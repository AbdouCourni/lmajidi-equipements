  // src/components/dashboard/image-upload.tsx

  'use client';

  import Image from 'next/image';

  import {
    useCallback,
    useState,
  } from 'react';

  import type {
    ProductImage,
  } from '../../types/product';

  interface ImageUploadProps {
    images: ProductImage[];

    onChange: (
      images: ProductImage[]
    ) => void;

    maxImages?: number;
  }

  export function ImageUpload({
    images,
    onChange,
    maxImages = 10,
  }: ImageUploadProps) {

    const [uploading, setUploading] =
      useState(false);

    /* =========================================================
      UPLOAD
    ========================================================= */

    const uploadToCloudinary = async (
      file: File
    ): Promise<ProductImage> => {

      const formData = new FormData();

      formData.append('file', file);

      formData.append(
        'upload_preset',
        'europmat_unsigned'
      );

      const cloudName =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error(
          'Missing cloud name'
        );
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.error(data);

        throw new Error(
          data?.error?.message ||
          'Upload failed'
        );
      }

      return {
        id: crypto.randomUUID(),
        url: data.secure_url,
        publicId: data.public_id,
        isPrimary: images.length === 0,
      };
    };

    /* =========================================================
      HANDLE FILES
    ========================================================= */

    const handleFiles = useCallback(
      async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {

        const files = Array.from(
          e.target.files || []
        );

        if (!files.length) {
          return;
        }

        if (
          images.length + files.length >
          maxImages
        ) {

          alert(
            `Maximum ${maxImages} images`
          );

          return;
        }

        try {

          setUploading(true);

          const uploaded =
            await Promise.all(
              files.map(uploadToCloudinary)
            );

          onChange([
            ...images,
            ...uploaded,
          ]);

        } catch (error) {

          console.error(error);

          alert(
            'Failed to upload images'
          );

        } finally {

          setUploading(false);

        }
      },
      [images, maxImages, onChange]
    );

    /* =========================================================
      REMOVE IMAGE
    ========================================================= */

    const removeImage = (
      id: string
    ) => {

      let updated = images.filter(
        img => img.id !== id
      );

      // Ensure one primary image
      if (
        updated.length > 0 &&
        !updated.some(
          img => img.isPrimary
        )
      ) {

        updated[0].isPrimary = true;
      }

      onChange(updated);
    };

    /* =========================================================
      SET PRIMARY
    ========================================================= */

    const setPrimaryImage = (
      id: string
    ) => {

      const updated = images.map(
        img => ({
          ...img,
          isPrimary: img.id === id,
        })
      );

      onChange(updated);
    };

    /* =========================================================
      UI
    ========================================================= */

    return (
      <div>

        {/* UPLOAD */}
        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer bg-white">

          <div className="text-center">

            <p className="font-medium">
              Upload Images
            </p>

            <p className="text-sm text-gray-500">
              Max {maxImages} images
            </p>

          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFiles}
          />

        </label>

        {/* LOADING */}
        {uploading && (
          <p className="mt-4 text-sm">
            Uploading...
          </p>
        )}

        {/* IMAGES */}
        {images.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            {images.map(image => (

              <div
                key={image.id}
                className="relative border rounded-xl overflow-hidden"
              >

                <div className="relative aspect-square">

                  <Image
                    src={image.url}
                    alt=""
                    fill
                    className="object-cover"
                  />

                </div>

                {/* ACTIONS */}
                <div className="p-2 flex flex-col gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setPrimaryImage(
                        image.id
                      )
                    }
                    className={`text-xs px-2 py-1 rounded ${
                      image.isPrimary
                        ? 'bg-navy-main text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {image.isPrimary
                      ? 'Primary'
                      : 'Set Primary'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(
                        image.id
                      )
                    }
                    className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    );
  }