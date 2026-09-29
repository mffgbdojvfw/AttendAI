import math
import numpy as np


class SimilarityTransform:
    """
    Minimal replacement for skimage.transform.SimilarityTransform.

    Supports the parts used by InsightFace:
    - SimilarityTransform()
    - SimilarityTransform(scale=..., rotation=..., translation=...)
    - estimate(src, dst)
    - params
    """

    def __init__(
        self,
        matrix=None,
        scale=None,
        rotation=None,
        translation=None,
    ):
        params_given = any(
            value is not None
            for value in (scale, rotation, translation)
        )

        if params_given and matrix is not None:
            raise ValueError(
                "You cannot specify matrix together with "
                "scale, rotation, or translation."
            )

        if matrix is not None:
            matrix = np.asarray(matrix, dtype=np.float64)

            if matrix.shape != (3, 3):
                raise ValueError(
                    "Transformation matrix must have shape (3, 3)."
                )

            self._matrix = matrix.copy()

        elif params_given:
            if scale is None:
                scale = 1.0

            if rotation is None:
                rotation = 0.0

            if translation is None:
                translation = (0.0, 0.0)

            cos_rotation = math.cos(rotation)
            sin_rotation = math.sin(rotation)

            self._matrix = np.array(
                [
                    [
                        scale * cos_rotation,
                        -scale * sin_rotation,
                        translation[0],
                    ],
                    [
                        scale * sin_rotation,
                        scale * cos_rotation,
                        translation[1],
                    ],
                    [0.0, 0.0, 1.0],
                ],
                dtype=np.float64,
            )

        else:
            self._matrix = np.eye(3, dtype=np.float64)

    @property
    def params(self):
        return self._matrix

    def estimate(self, src, dst):
        """
        Estimate a 2D similarity transformation using least squares.

        This follows the same mathematical purpose as
        skimage.transform.SimilarityTransform.estimate().
        """

        src = np.asarray(src, dtype=np.float64)
        dst = np.asarray(dst, dtype=np.float64)

        if src.ndim != 2 or dst.ndim != 2:
            raise ValueError("src and dst must be 2D arrays.")

        if src.shape != dst.shape:
            raise ValueError("src and dst must have the same shape.")

        if src.shape[1] != 2:
            raise ValueError("src and dst must contain 2D points.")

        if src.shape[0] < 2:
            raise ValueError(
                "At least two corresponding points are required."
            )

        src_mean = src.mean(axis=0)
        dst_mean = dst.mean(axis=0)

        src_centered = src - src_mean
        dst_centered = dst - dst_mean

        src_norm = np.sqrt(
            np.sum(src_centered ** 2)
        )

        if src_norm == 0:
            raise ValueError(
                "Source points cannot all be identical."
            )

        src_normalized = src_centered / src_norm

        dst_norm = np.sqrt(
            np.sum(dst_centered ** 2)
        )

        if dst_norm == 0:
            raise ValueError(
                "Destination points cannot all be identical."
            )

        dst_normalized = dst_centered / dst_norm

        matrix = np.dot(
            dst_normalized.T,
            src_normalized,
        )

        u, _, vt = np.linalg.svd(matrix)

        rotation = np.dot(u, vt)

        if np.linalg.det(rotation) < 0:
            vt[-1, :] *= -1
            rotation = np.dot(u, vt)

        scale = dst_norm / src_norm

        linear = scale * rotation

        translation = dst_mean - np.dot(
            linear,
            src_mean,
        )

        self._matrix = np.eye(3, dtype=np.float64)

        self._matrix[:2, :2] = linear
        self._matrix[:2, 2] = translation

        return True