use wasm_bindgen::prelude::*;
use std::collections::{HashMap};

use rxing::{
    Luma8LuminanceSource,
    DecodeHintValue,
    DecodeHintType,
    BinaryBitmap,
    self,
    ResultPoint,
    Reader,
    common::HybridBinarizer,
    qrcode::QRCodeReader
};

#[derive(Clone)]
#[wasm_bindgen]
pub struct BarcodeResult {
    text: String,
    raw_bytes: Vec<u8>,
    num_bits: usize,
    result_points: Vec<f32>,
    timestamp: isize,
}

#[wasm_bindgen]
impl BarcodeResult {
    pub fn timestamp(&self) -> isize {
        self.timestamp
    }

    /// Each pair of f32 values is an (x,y) point
    pub fn result_points(&self) -> Vec<f32> {
        self.result_points.to_vec()
    }

    pub fn num_bits(&self) -> usize {
        self.num_bits
    }

    pub fn raw_bytes(&self) -> Vec<u8> {
        self.raw_bytes.to_vec()
    }

    pub fn text(&self) -> String {
        self.text.to_owned()
    }

}

impl From<rxing::RXingResult> for BarcodeResult {
    fn from(value: rxing::RXingResult) -> Self {
        Self {
            text: value.getText().to_owned(),
            raw_bytes: value.getRawBytes().to_vec(),
            num_bits: value.getNumBits(),
            result_points: value
                .getRXingResultPoints()
                .iter()
                .flat_map(|rxp| [rxp.getX(), rxp.getY()])
                .collect(),
            timestamp: value.getTimestamp() as isize,
        }
    }
}

#[wasm_bindgen]
/// Decode a QR code from an array of 8bit luma data
pub fn decode_qrcode(
    luma: Vec<u8>,
    width: u32,
    height: u32,
    try_harder: Option<bool>,
) -> Result<BarcodeResult, String> {
    let mut hints: rxing::DecodingHintDictionary = HashMap::new();
    let mut reader = QRCodeReader::default();

    hints
        .entry(DecodeHintType::TRY_HARDER)
        .or_insert(DecodeHintValue::TryHarder(try_harder.unwrap_or(false)));

    let mut bmp = BinaryBitmap::new(HybridBinarizer::new(Luma8LuminanceSource::new(
        luma, width, height,
    )));

    let rx_res = reader.decode_with_hints(&mut bmp, &hints);
    match rx_res {
        Ok(result) => Ok(result.into()),
        Err(e) => Err(e.to_string()),
    }
}

#[wasm_bindgen]
/// Convert a javascript image context's data into luma 8.
///
/// Data for this function can be found from any canvas object
/// using the `data` property of an `ImageData` object.
/// Such an object could be obtained using the `getImageData`
/// method of a `CanvasRenderingContext2D` object.
pub fn convert_js_image_to_luma(data: &[u8]) -> Vec<u8> {
    let mut luma_data = Vec::with_capacity(data.len() / 4);
    for src_pixel in data.chunks_exact(4) {
        let [red, green, blue, alpha] = src_pixel else {
            continue;
        };
        let pixel = if *alpha == 0 {
            // white, so we know its luminance is 255
            0xFF
        } else {
            // .299R + 0.587G + 0.114B (YUV/YIQ for PAL and NTSC),
            // (306*R) >> 10 is approximately equal to R*0.299, and so on.
            // 0x200 >> 10 is 0.5, it implements rounding.

            ((306 * (*red as u64) + 601 * (*green as u64) + 117 * (*blue as u64) + 0x200) >> 10)
                as u8
        };
        luma_data.push(pixel);
    }

    luma_data
}
