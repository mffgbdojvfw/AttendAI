# # import math
# # import numpy as np


# # class SimilarityTransform:
# #     """
# #     Minimal replacement for skimage.transform.SimilarityTransform.

# #     Supports the parts used by InsightFace:
# #     - SimilarityTransform()
# #     - SimilarityTransform(scale=..., rotation=..., translation=...)
# #     - estimate(src, dst)
# #     - params
# #     """

# #     def __init__(
# #         self,
# #         matrix=None,
# #         scale=None,
# #         rotation=None,
# #         translation=None,
# #     ):
# #         params_given = any(
# #             value is not None
# #             for value in (scale, rotation, translation)
# #         )

# #         if params_given and matrix is not None:
# #             raise ValueError(
# #                 "You cannot specify matrix together with "
# #                 "scale, rotation, or translation."
# #             )

# #         if matrix is not None:
# #             matrix = np.asarray(matrix, dtype=np.float64)

# #             if matrix.shape != (3, 3):
# #                 raise ValueError(
# #                     "Transformation matrix must have shape (3, 3)."
# #                 )

# #             self._matrix = matrix.copy()

# #         elif params_given:
# #             if scale is None:
# #                 scale = 1.0

# #             if rotation is None:
# #                 rotation = 0.0

# #             if translation is None:
# #                 translation = (0.0, 0.0)

# #             cos_rotation = math.cos(rotation)
# #             sin_rotation = math.sin(rotation)

# #             self._matrix = np.array(
# #                 [
# #                     [
# #                         scale * cos_rotation,
# #                         -scale * sin_rotation,
# #                         translation[0],
# #                     ],
# #                     [
# #                         scale * sin_rotation,
# #                         scale * cos_rotation,
# #                         translation[1],
# #                     ],
# #                     [0.0, 0.0, 1.0],
# #                 ],
# #                 dtype=np.float64,
# #             )

# #         else:
# #             self._matrix = np.eye(3, dtype=np.float64)

# #     @property
# #     def params(self):
# #         return self._matrix

# #     def estimate(self, src, dst):
# #         """
# #         Estimate a 2D similarity transformation using least squares.

# #         This follows the same mathematical purpose as
# #         skimage.transform.SimilarityTransform.estimate().
# #         """

# #         src = np.asarray(src, dtype=np.float64)
# #         dst = np.asarray(dst, dtype=np.float64)

# #         if src.ndim != 2 or dst.ndim != 2:
# #             raise ValueError("src and dst must be 2D arrays.")

# #         if src.shape != dst.shape:
# #             raise ValueError("src and dst must have the same shape.")

# #         if src.shape[1] != 2:
# #             raise ValueError("src and dst must contain 2D points.")

# #         if src.shape[0] < 2:
# #             raise ValueError(
# #                 "At least two corresponding points are required."
# #             )

# #         src_mean = src.mean(axis=0)
# #         dst_mean = dst.mean(axis=0)

# #         src_centered = src - src_mean
# #         dst_centered = dst - dst_mean

# #         src_norm = np.sqrt(
# #             np.sum(src_centered ** 2)
# #         )

# #         if src_norm == 0:
# #             raise ValueError(
# #                 "Source points cannot all be identical."
# #             )

# #         src_normalized = src_centered / src_norm

# #         dst_norm = np.sqrt(
# #             np.sum(dst_centered ** 2)
# #         )

# #         if dst_norm == 0:
# #             raise ValueError(
# #                 "Destination points cannot all be identical."
# #             )

# #         dst_normalized = dst_centered / dst_norm

# #         matrix = np.dot(
# #             dst_normalized.T,
# #             src_normalized,
# #         )

# #         u, _, vt = np.linalg.svd(matrix)

# #         rotation = np.dot(u, vt)

# #         if np.linalg.det(rotation) < 0:
# #             vt[-1, :] *= -1
# #             rotation = np.dot(u, vt)

# #         scale = dst_norm / src_norm

# #         linear = scale * rotation

# #         translation = dst_mean - np.dot(
# #             linear,
# #             src_mean,
# #         )

# #         self._matrix = np.eye(3, dtype=np.float64)

# #         self._matrix[:2, :2] = linear
# #         self._matrix[:2, 2] = translation

# #         return True




# import numpy as np


# class SimilarityTransform:
#     """
#     Lightweight compatibility implementation of
#     skimage.transform.SimilarityTransform.

#     Supports the functionality required by InsightFace:
#     - scale
#     - rotation
#     - translation
#     - params
#     - estimate()
#     - inverse
#     - __call__()
#     - transform composition using +
#     """

#     def __init__(
#         self,
#         matrix=None,
#         scale=None,
#         rotation=None,
#         translation=None,
#     ):
#         self.params = np.eye(3, dtype=np.float64)

#         if matrix is not None:
#             matrix = np.asarray(matrix, dtype=np.float64)

#             if matrix.shape != (3, 3):
#                 raise ValueError(
#                     "matrix must have shape (3, 3)"
#                 )

#             self.params = matrix.copy()

#         elif (
#             scale is not None
#             or rotation is not None
#             or translation is not None
#         ):
#             scale = (
#                 1.0
#                 if scale is None
#                 else float(scale)
#             )

#             rotation = (
#                 0.0
#                 if rotation is None
#                 else float(rotation)
#             )

#             if translation is None:
#                 translation = (0.0, 0.0)

#             tx = float(translation[0])
#             ty = float(translation[1])

#             cos_theta = np.cos(rotation)
#             sin_theta = np.sin(rotation)

#             self.params = np.array(
#                 [
#                     [
#                         scale * cos_theta,
#                         -scale * sin_theta,
#                         tx,
#                     ],
#                     [
#                         scale * sin_theta,
#                         scale * cos_theta,
#                         ty,
#                     ],
#                     [0.0, 0.0, 1.0],
#                 ],
#                 dtype=np.float64,
#             )

#     # --------------------------------------------------
#     # Properties
#     # --------------------------------------------------

#     @property
#     def scale(self):
#         """
#         Return the scale component.
#         """
#         return float(
#             np.sqrt(
#                 self.params[0, 0] ** 2
#                 + self.params[1, 0] ** 2
#             )
#         )

#     @property
#     def rotation(self):
#         """
#         Return rotation in radians.
#         """
#         return float(
#             np.arctan2(
#                 self.params[1, 0],
#                 self.params[0, 0],
#             )
#         )

#     @property
#     def translation(self):
#         """
#         Return translation as [x, y].
#         """
#         return self.params[:2, 2].copy()

#     # --------------------------------------------------
#     # Transform composition
#     # --------------------------------------------------

#     def __add__(self, other):
#         """
#         Compose two similarity transformations.

#         This is required by InsightFace / ArcFace
#         alignment code.
#         """

#         if not isinstance(
#             other,
#             SimilarityTransform,
#         ):
#             return NotImplemented

#         return SimilarityTransform(
#             matrix=np.dot(
#                 self.params,
#                 other.params,
#             )
#         )

#     def __radd__(self, other):
#         """
#         Support sum() and reverse addition.
#         """

#         if other == 0:
#             return self

#         if not isinstance(
#             other,
#             SimilarityTransform,
#         ):
#             return NotImplemented

#         return SimilarityTransform(
#             matrix=np.dot(
#                 other.params,
#                 self.params,
#             )
#         )

#     # --------------------------------------------------
#     # Estimate similarity transform
#     # --------------------------------------------------

#     def estimate(self, src, dst):
#         """
#         Estimate a similarity transformation from
#         source points to destination points.

#         Parameters
#         ----------
#         src : array-like, shape (N, 2)
#             Source coordinates.

#         dst : array-like, shape (N, 2)
#             Destination coordinates.

#         Returns
#         -------
#         bool
#             True if successful.
#         """

#         src = np.asarray(
#             src,
#             dtype=np.float64,
#         )

#         dst = np.asarray(
#             dst,
#             dtype=np.float64,
#         )

#         if src.ndim != 2 or dst.ndim != 2:
#             return False

#         if src.shape != dst.shape:
#             return False

#         if src.shape[1] != 2:
#             return False

#         if src.shape[0] < 2:
#             return False

#         # Remove centroids
#         src_mean = src.mean(axis=0)
#         dst_mean = dst.mean(axis=0)

#         src_centered = src - src_mean
#         dst_centered = dst - dst_mean

#         # Normalize using the source/destination
#         # covariance matrix.
#         covariance = np.dot(
#             dst_centered.T,
#             src_centered,
#         )

#         try:
#             U, singular_values, Vt = np.linalg.svd(
#                 covariance
#             )
#         except np.linalg.LinAlgError:
#             return False

#         R = np.dot(
#             U,
#             Vt,
#         )

#         # Prevent reflection.
#         if np.linalg.det(R) < 0:
#             Vt[-1, :] *= -1
#             R = np.dot(
#                 U,
#                 Vt,
#             )

#         src_variance = np.sum(
#             src_centered ** 2
#         )

#         if src_variance <= np.finfo(float).eps:
#             return False

#         scale = (
#             np.sum(singular_values)
#             / src_variance
#         )

#         translation = (
#             dst_mean
#             - scale
#             * np.dot(
#                 R,
#                 src_mean,
#             )
#         )

#         self.params = np.eye(
#             3,
#             dtype=np.float64,
#         )

#         self.params[:2, :2] = (
#             scale * R
#         )

#         self.params[:2, 2] = (
#             translation
#         )

#         return True

#     # --------------------------------------------------
#     # Apply transform
#     # --------------------------------------------------

#     def __call__(self, coords):
#         """
#         Apply the transformation to coordinates.
#         """

#         coords = np.asarray(
#             coords,
#             dtype=np.float64,
#         )

#         original_shape = coords.shape

#         if (
#             coords.ndim == 1
#             and coords.shape[0] == 2
#         ):
#             coords_2d = coords.reshape(
#                 1,
#                 2,
#             )
#         elif (
#             coords.ndim == 2
#             and coords.shape[1] == 2
#         ):
#             coords_2d = coords
#         else:
#             raise ValueError(
#                 "Coordinates must have shape (N, 2) "
#                 "or (2,)"
#             )

#         ones = np.ones(
#             (
#                 coords_2d.shape[0],
#                 1,
#             ),
#             dtype=np.float64,
#         )

#         homogeneous = np.concatenate(
#             [
#                 coords_2d,
#                 ones,
#             ],
#             axis=1,
#         )

#         transformed = np.dot(
#             homogeneous,
#             self.params.T,
#         )

#         result = transformed[:, :2]

#         if len(original_shape) == 1:
#             return result[0]

#         return result

#     # --------------------------------------------------
#     # Inverse transform
#     # --------------------------------------------------

#     @property
#     def inverse(self):
#         """
#         Return inverse similarity transformation.
#         """

#         return SimilarityTransform(
#             matrix=np.linalg.inv(
#                 self.params
#             )
#         )

#     # --------------------------------------------------
#     # Representation
#     # --------------------------------------------------

#     def __repr__(self):
#         return (
#             "SimilarityTransform("
#             f"matrix={self.params!r}"
#             ")"
#         )




import math
import numpy as np


class SimilarityTransform:
    """
    Lightweight compatibility implementation of
    skimage.transform.SimilarityTransform.

    Supports the functionality required by InsightFace:

    - scale
    - rotation
    - translation
    - params
    - estimate()
    - inverse
    - __call__()
    - transformation composition using +
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
            for value in (
                scale,
                rotation,
                translation,
            )
        )

        if matrix is not None and params_given:
            raise ValueError(
                "You cannot specify matrix together with "
                "scale, rotation, or translation."
            )

        # -------------------------------------------------
        # Existing transformation matrix
        # -------------------------------------------------

        if matrix is not None:
            matrix = np.asarray(
                matrix,
                dtype=np.float64,
            )

            if matrix.shape != (3, 3):
                raise ValueError(
                    "Transformation matrix must have "
                    "shape (3, 3)."
                )

            self._matrix = matrix.copy()
            return

        # -------------------------------------------------
        # Transformation from parameters
        # -------------------------------------------------

        if params_given:
            if scale is None:
                scale = 1.0

            if rotation is None:
                rotation = 0.0

            if translation is None:
                translation = (0.0, 0.0)

            scale = float(scale)
            rotation = float(rotation)

            tx = float(translation[0])
            ty = float(translation[1])

            cos_rotation = math.cos(rotation)
            sin_rotation = math.sin(rotation)

            self._matrix = np.array(
                [
                    [
                        scale * cos_rotation,
                        -scale * sin_rotation,
                        tx,
                    ],
                    [
                        scale * sin_rotation,
                        scale * cos_rotation,
                        ty,
                    ],
                    [
                        0.0,
                        0.0,
                        1.0,
                    ],
                ],
                dtype=np.float64,
            )

            return

        # -------------------------------------------------
        # Identity transformation
        # -------------------------------------------------

        self._matrix = np.eye(
            3,
            dtype=np.float64,
        )

    # =====================================================
    # PARAMETERS
    # =====================================================

    @property
    def params(self):
        return self._matrix

    @property
    def scale(self):
        """
        Return the scale factor.
        """

        return math.sqrt(
            self._matrix[0, 0] ** 2
            + self._matrix[1, 0] ** 2
        )

    @property
    def rotation(self):
        """
        Return rotation in radians.
        """

        return math.atan2(
            self._matrix[1, 0],
            self._matrix[0, 0],
        )

    @property
    def translation(self):
        """
        Return translation as [x, y].
        """

        return self._matrix[
            0:2,
            2
        ].copy()

    # =====================================================
    # TRANSFORMATION COMPOSITION
    # =====================================================

    def __add__(self, other):
        """
        Combine two geometric transformations.

        If:

            A = first transformation
            B = second transformation

        then:

            A + B

        means B is applied after A.
        """

        if not isinstance(
            other,
            SimilarityTransform,
        ):
            raise TypeError(
                "Cannot combine transformations of "
                "different types."
            )

        combined_matrix = np.dot(
            other._matrix,
            self._matrix,
        )

        return SimilarityTransform(
            matrix=combined_matrix
        )

    # =====================================================
    # RIGHT-SIDE ADDITION
    # =====================================================

    def __radd__(self, other):
        """
        Support reverse addition and sum().
        """

        if other == 0:
            return self

        return self.__add__(other)

    # =====================================================
    # ESTIMATE SIMILARITY TRANSFORMATION
    # =====================================================

    def estimate(
        self,
        src,
        dst,
    ):
        """
        Estimate a similarity transformation that maps
        src points to dst points.

        Uses a least-squares Procrustes/Umeyama-style
        solution.
        """

        src = np.asarray(
            src,
            dtype=np.float64,
        )

        dst = np.asarray(
            dst,
            dtype=np.float64,
        )

        if src.ndim != 2 or dst.ndim != 2:
            raise ValueError(
                "src and dst must be 2-dimensional arrays."
            )

        if src.shape != dst.shape:
            raise ValueError(
                "src and dst must have the same shape."
            )

        if src.shape[1] != 2:
            raise ValueError(
                "src and dst must contain 2D points."
            )

        if src.shape[0] < 2:
            raise ValueError(
                "At least two corresponding points "
                "are required."
            )

        # -------------------------------------------------
        # Calculate centroids
        # -------------------------------------------------

        src_mean = np.mean(
            src,
            axis=0,
        )

        dst_mean = np.mean(
            dst,
            axis=0,
        )

        src_centered = (
            src - src_mean
        )

        dst_centered = (
            dst - dst_mean
        )

        # -------------------------------------------------
        # Source variance
        # -------------------------------------------------

        src_variance = np.mean(
            np.sum(
                src_centered ** 2,
                axis=1,
            )
        )

        if src_variance <= 0:
            raise ValueError(
                "Source points cannot all be identical."
            )

        # -------------------------------------------------
        # Covariance matrix
        # -------------------------------------------------

        covariance = (
            dst_centered.T
            @ src_centered
            / src.shape[0]
        )

        # -------------------------------------------------
        # SVD
        # -------------------------------------------------

        U, singular_values, Vt = np.linalg.svd(
            covariance
        )

        correction = np.eye(
            2,
            dtype=np.float64,
        )

        if np.linalg.det(
            U @ Vt
        ) < 0:

            correction[-1, -1] = -1

        rotation_matrix = (
            U
            @ correction
            @ Vt
        )

        # -------------------------------------------------
        # Scale
        # -------------------------------------------------

        scale = (
            np.sum(
                singular_values
                * np.diag(correction)
            )
            / src_variance
        )

        # -------------------------------------------------
        # Linear transformation
        # -------------------------------------------------

        linear = (
            scale
            * rotation_matrix
        )

        # -------------------------------------------------
        # Translation
        # -------------------------------------------------

        translation = (
            dst_mean
            - linear @ src_mean
        )

        # -------------------------------------------------
        # Final 3x3 matrix
        # -------------------------------------------------

        self._matrix = np.eye(
            3,
            dtype=np.float64,
        )

        self._matrix[
            0:2,
            0:2
        ] = linear

        self._matrix[
            0:2,
            2
        ] = translation

        return True

    # =====================================================
    # INVERSE TRANSFORMATION
    # =====================================================

    @property
    def inverse(self):
        """
        Return the inverse transformation.
        """

        return SimilarityTransform(
            matrix=np.linalg.inv(
                self._matrix
            )
        )

    # =====================================================
    # APPLY TRANSFORMATION TO POINTS
    # =====================================================

    def __call__(self, points):
        """
        Apply transformation to Nx2 points.

        A single point with shape (2,) is also supported.
        """

        points = np.asarray(
            points,
            dtype=np.float64,
        )

        original_shape = points.shape

        if points.ndim == 1:

            if points.shape[0] != 2:
                raise ValueError(
                    "Points must have shape (N, 2) "
                    "or (2,)."
                )

            points_2d = points.reshape(
                1,
                2,
            )

        elif points.ndim == 2:

            if points.shape[1] != 2:
                raise ValueError(
                    "Points must have shape (N, 2) "
                    "or (2,)."
                )

            points_2d = points

        else:

            raise ValueError(
                "Points must have shape (N, 2) "
                "or (2,)."
            )

        # -------------------------------------------------
        # Convert to homogeneous coordinates
        # -------------------------------------------------

        homogeneous = np.column_stack(
            [
                points_2d,
                np.ones(
                    points_2d.shape[0],
                    dtype=np.float64,
                ),
            ]
        )

        # -------------------------------------------------
        # Apply transformation
        # -------------------------------------------------

        transformed = (
            homogeneous
            @ self._matrix.T
        )

        result = transformed[
            :,
            :2
        ]

        # Preserve single-point input shape
        if len(original_shape) == 1:
            return result[0]

        return result

    # =====================================================
    # REPRESENTATION
    # =====================================================

    def __repr__(self):
        return (
            "SimilarityTransform("
            f"matrix={self._matrix!r}"
            ")"
        )