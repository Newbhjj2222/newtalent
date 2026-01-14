export const uploadToCloudinary = async (file, type = "image") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Newtalents");
  formData.append("cloud_name", "dilowy3fd");

  const endpoint =
    type === "audio"
      ? "https://api.cloudinary.com/v1_1/dilowy3fd/video/upload"
      : "https://api.cloudinary.com/v1_1/dilowy3fd/image/upload";

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};
