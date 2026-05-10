// src/components/dashboard/single-image-upload.tsx

'use client';

import Image from 'next/image';

import {
  useCallback,
  useState,
} from 'react';

interface SingleImageUploadProps {
  image?: string;

  onChange: (
    image: string
  ) => void;

  folder?: string;

  label?: string;
}

export function SingleImageUpload({
  image,
  onChange,
  folder = 'europmat/categories',
  label = 'Upload Image',
}: SingleImageUploadProps) {

  const [uploading, setUploading] =
    useState(false);

  /* =========================================================
     UPLOAD TO CLOUDINARY
  ========================================================= */

  const uploadToCloudinary = async (
    file: File
  ): Promise<string> => {

    const cloudName =
      process.env
        .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {

      throw new Error(
        'Missing Cloudinary cloud name'
      );
    }

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    formData.append(
      'upload_preset',
      'europmat_unsigned'
    );

    formData.append(
      'folder',
      folder
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      console.error(
        'Cloudinary error:',
        data
      );

      throw new Error(
        data?.error?.message ||
        'Upload failed'
      );
    }

    return data.secure_url;
  };

  /* =========================================================
     HANDLE FILE
  ========================================================= */

  const handleFile = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      try {

        setUploading(true);

        const uploadedImage =
          await uploadToCloudinary(
            file
          );

        onChange(uploadedImage);

      } catch (error) {

        console.error(error);

        alert(
          'Failed to upload image'
        );

      } finally {

        setUploading(false);

      }
    },
    [folder, onChange]
  );

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = () => {

    onChange('');
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div>

      {/* LABEL */}
      <label className="block text-sm font-medium mb-3">

        {label}

      </label>

      {/* EMPTY STATE */}
      {!image && (

        <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-2xl cursor-pointer bg-white hover:border-navy-accent transition">

          <div className="text-center px-6">

            <div className="text-4xl mb-3">
              🖼️
            </div>

            <p className="font-medium text-charcoal">
              Click to upload image
            </p>

            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WEBP
            </p>

          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />

        </label>
      )}

      {/* LOADING */}
      {uploading && (

        <div className="mt-4 text-sm text-navy-accent">

          Uploading image...

        </div>
      )}

      {/* IMAGE PREVIEW */}
      {image && (

        <div className="relative border rounded-2xl overflow-hidden bg-white">

          <div className="relative aspect-video">

            <Image
              src={image}
              alt="Uploaded image"
              fill
              className="object-cover"
            />

          </div>

          {/* ACTIONS */}
          <div className="p-4 flex items-center justify-between">

            {/* REPLACE */}
            <label className="btn-secondary cursor-pointer">

              Replace Image

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleFile}
              />

            </label>

            {/* REMOVE */}
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Remove
            </button>

          </div>

        </div>
      )}

    </div>
  );
}