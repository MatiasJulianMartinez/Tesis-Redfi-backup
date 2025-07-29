export const generarIconoMultiProveedor = async () => {
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users-group" width="75" height="75" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="9" cy="7" r="4" />
      <path d="M17 11v-1a4 4 0 1 0 -3 3.85" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
      <path d="M15 19l2 2l4 -4" />
    </svg>
  `;

  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        const bitmap = await createImageBitmap(blob);
        resolve(bitmap);
        URL.revokeObjectURL(url);
      });
    };
    img.src = url;
  });
};
