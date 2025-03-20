export const encodeQRData = (data: object): string => {
  // JSON objesini stringe çevir
  const jsonString = JSON.stringify(data);

  // Base64'e dönüştür
  return btoa(jsonString);
};

export const decodeQRData = (encodedData: string): object => {
  try {
    // Base64'ten stringe çevir
    const jsonString = atob(encodedData);

    // JSON parse et
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('QR kod çözümleme hatası:', error);
    throw new Error('Geçersiz QR kod verisi');
  }
};
