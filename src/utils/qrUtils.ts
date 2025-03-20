export const encodeQRData = (data: object): string => {
  try {
    // JSON objesini stringe çevir
    const jsonString = JSON.stringify(data);

    // String'i UTF-8 encoding ile base64'e dönüştür
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (error) {
    console.error('Encoding error:', error);
    throw new Error('Veri şifrelenirken bir hata oluştu');
  }
};

export const decodeQRData = (encodedData: string): object => {
  try {
    // Base64'ten UTF-8 string'e çevir
    const jsonString = decodeURIComponent(escape(atob(encodedData)));

    // JSON parse et
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decoding error:', error);
    throw new Error('QR kod çözümleme hatası');
  }
};
