export default function useImageResizer() {
  const resizeImage = (
    e: ProgressEvent<FileReader>,
    avatar: Ref<string | ArrayBuffer | null>,
    showText: Ref<boolean>,
    newWidth: number,
    newHeigth: number
  ) => {
    if (e.target && typeof e.target.result === 'string') {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = newWidth;
        const MAX_HEIGHT = newHeigth;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        const newDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        avatar.value = newDataUrl;
        showText.value = false;
      };
    }
  };

  return { resizeImage };
}
