let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

const cachedTextDecoder =
  typeof TextDecoder !== "undefined"
    ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error("TextDecoder not available");
        },
      };

if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder =
  typeof TextEncoder !== "undefined"
    ? new TextEncoder("utf-8")
    : {
        encode: () => {
          throw Error("TextEncoder not available");
        },
      };

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
  if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
    cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
  }
  return cachedFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * Encode a barcode with the given data, dimensions, and type
 * @param {string} data
 * @param {number} width
 * @param {number} height
 * @param {BarcodeFormat} bc_type
 * @returns {string}
 */
export function encode_barcode(data, width, height, bc_type) {
  let deferred3_0;
  let deferred3_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.encode_barcode(retptr, ptr0, len0, width, height, bc_type);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr2 = r0;
    var len2 = r1;
    if (r3) {
      ptr2 = 0;
      len2 = 0;
      throw takeObject(r2);
    }
    deferred3_0 = ptr2;
    deferred3_1 = len2;
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
  }
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
/**
 * Encode a barcode with the given data, dimensions, and type, use the given encoding hints
 * @param {string} data
 * @param {number} width
 * @param {number} height
 * @param {BarcodeFormat} bc_type
 * @param {EncodeHintDictionary} hints
 * @returns {string}
 */
export function encode_barcode_with_hints(data, width, height, bc_type, hints) {
  let deferred3_0;
  let deferred3_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(hints, EncodeHintDictionary);
    wasm.encode_barcode_with_hints(retptr, ptr0, len0, width, height, bc_type, hints.__wbg_ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr2 = r0;
    var len2 = r1;
    if (r3) {
      ptr2 = 0;
      len2 = 0;
      throw takeObject(r2);
    }
    deferred3_0 = ptr2;
    deferred3_1 = len2;
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
  }
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}
/**
 * Decode a barcode from an array of 8bit luma data
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {boolean | undefined} [try_harder]
 * @returns {BarcodeResult}
 */
export function decode_barcode(data, width, height, try_harder) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.decode_barcode(retptr, ptr0, len0, width, height, isLikeNone(try_harder) ? 0xffffff : try_harder ? 1 : 0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BarcodeResult.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * Convert a javascript image context's data into luma 8.
 *
 * Data for this function can be found from any canvas object
 * using the `data` property of an `ImageData` object.
 * Such an object could be obtained using the `getImageData`
 * method of a `CanvasRenderingContext2D` object.
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
export function convert_js_image_to_luma(data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.convert_js_image_to_luma(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4, 4) >>> 0;
  getUint32Memory0().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * Decode a barcode from an array of rgba data.
 * Pixel data is in the form of:
 *     Each pixel is one u32, [r,g,b].
 * @param {Uint32Array} data
 * @param {number} width
 * @param {number} height
 * @param {boolean | undefined} [try_harder]
 * @returns {BarcodeResult}
 */
export function decode_barcode_rgb(data, width, height, try_harder) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.decode_barcode_rgb(retptr, ptr0, len0, width, height, isLikeNone(try_harder) ? 0xffffff : try_harder ? 1 : 0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BarcodeResult.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {DecodeHintDictionary} hints
 * @returns {BarcodeResult}
 */
export function decode_barcode_with_hints(data, width, height, hints) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(hints, DecodeHintDictionary);
    wasm.decode_barcode_with_hints(retptr, ptr0, len0, width, height, hints.__wbg_ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BarcodeResult.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 * @param {DecodeHintDictionary} hints
 * @returns {MultiDecodeResult}
 */
export function decode_multi(data, width, height, hints) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(hints, DecodeHintDictionary);
    wasm.decode_multi(retptr, ptr0, len0, width, height, hints.__wbg_ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return MultiDecodeResult.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 */
export const EncodeHintTypes = Object.freeze({
  /**
   *
   *     * Specifies what degree of error correction to use, for example in QR Codes.
   *     * Type depends on the encoder. For example for QR codes it's type
   *     * {@link com.google.zxing.qrcode.decoder.ErrorCorrectionLevel ErrorCorrectionLevel}.
   *     * For Aztec it is of type {@link Integer}, representing the minimal percentage of error correction words.
   *     * For PDF417 it is of type {@link Integer}, valid values being 0 to 8.
   *     * In all cases, it can also be a {@link String} representation of the desired value as well.
   *     * Note: an Aztec symbol should have a minimum of 25% EC words.
   *
   */
  ErrorCorrection: 0,
  0: "ErrorCorrection",
  /**
   *
   *     * Specifies what character encoding to use where applicable (type {@link String})
   *
   */
  CharacterSet: 1,
  1: "CharacterSet",
  /**
   *
   *     * Specifies the matrix shape for Data Matrix (type {@link com.google.zxing.datamatrix.encoder.SymbolShapeHint})
   *
   */
  DataMatrixShape: 2,
  2: "DataMatrixShape",
  /**
   *
   *     * Specifies whether to use compact mode for Data Matrix (type {@link Boolean}, or "true" or "false"
   *     * {@link String } value).
   *     * The compact encoding mode also supports the encoding of characters that are not in the ISO-8859-1
   *     * character set via ECIs.
   *     * Please note that in that case, the most compact character encoding is chosen for characters in
   *     * the input that are not in the ISO-8859-1 character set. Based on experience, some scanners do not
   *     * support encodings like cp-1256 (Arabic). In such cases the encoding can be forced to UTF-8 by
   *     * means of the {@link #CHARACTER_SET} encoding hint.
   *     * Compact encoding also provides GS1-FNC1 support when {@link #GS1_FORMAT} is selected. In this case
   *     * group-separator character (ASCII 29 decimal) can be used to encode the positions of FNC1 codewords
   *     * for the purpose of delimiting AIs.
   *     * This option and {@link #FORCE_C40} are mutually exclusive.
   *
   */
  DataMatrixCompact: 3,
  3: "DataMatrixCompact",
  /**
   *
   *     * Specifies a minimum barcode size (type {@link Dimension}). Only applicable to Data Matrix now.
   *     *
   *     * @deprecated use width/height params in
   *     * {@link com.google.zxing.datamatrix.DataMatrixWriter#encode(String, BarcodeFormat, int, int)}
   *
   */
  MinSize: 4,
  4: "MinSize",
  /**
   *
   *     * Specifies a maximum barcode size (type {@link Dimension}). Only applicable to Data Matrix now.
   *     *
   *     * @deprecated without replacement
   *
   */
  MaxSize: 5,
  5: "MaxSize",
  /**
   *
   *     * Specifies margin, in pixels, to use when generating the barcode. The meaning can vary
   *     * by format; for example it controls margin before and after the barcode horizontally for
   *     * most 1D formats. (Type {@link Integer}, or {@link String} representation of the integer value).
   *
   */
  MARGIN: 6,
  6: "MARGIN",
  /**
   *
   *     * Specifies whether to use compact mode for PDF417 (type {@link Boolean}, or "true" or "false"
   *     * {@link String} value).
   *
   */
  Pdf417Compact: 7,
  7: "Pdf417Compact",
  /**
   *
   *     * Specifies what compaction mode to use for PDF417 (type
   *     * {@link com.google.zxing.pdf417.encoder.Compaction Compaction} or {@link String} value of one of its
   *     * enum values).
   *
   */
  Pdf417Compaction: 8,
  8: "Pdf417Compaction",
  /**
   *
   *     * Specifies the minimum and maximum number of rows and columns for PDF417 (type
   *     * {@link com.google.zxing.pdf417.encoder.Dimensions Dimensions}).
   *
   */
  Pdf417Dimensions: 9,
  9: "Pdf417Dimensions",
  /**
   *
   *     * Specifies whether to automatically insert ECIs when encoding PDF417 (type {@link Boolean}, or "true" or "false"
   *     * {@link String} value).
   *     * Please note that in that case, the most compact character encoding is chosen for characters in
   *     * the input that are not in the ISO-8859-1 character set. Based on experience, some scanners do not
   *     * support encodings like cp-1256 (Arabic). In such cases the encoding can be forced to UTF-8 by
   *     * means of the {@link #CHARACTER_SET} encoding hint.
   *
   */
  Pdf417AutoEci: 10,
  10: "Pdf417AutoEci",
  /**
   *
   *     * Specifies the required number of layers for an Aztec code.
   *     * A negative number (-1, -2, -3, -4) specifies a compact Aztec code.
   *     * 0 indicates to use the minimum number of layers (the default).
   *     * A positive number (1, 2, .. 32) specifies a normal (non-compact) Aztec code.
   *     * (Type {@link Integer}, or {@link String} representation of the integer value).
   *
   */
  AztecLayers: 11,
  11: "AztecLayers",
  /**
   *
   *     * Specifies the exact version of QR code to be encoded.
   *     * (Type {@link Integer}, or {@link String} representation of the integer value).
   *
   */
  QrVersion: 12,
  12: "QrVersion",
  /**
   *
   *     * Specifies the QR code mask pattern to be used. Allowed values are
   *     * 0..QRCode.NUM_MASK_PATTERNS-1. By default the code will automatically select
   *     * the optimal mask pattern.
   *     * * (Type {@link Integer}, or {@link String} representation of the integer value).
   *
   */
  QrMaskPattern: 13,
  13: "QrMaskPattern",
  /**
   *
   *     * Specifies whether to use compact mode for QR code (type {@link Boolean}, or "true" or "false"
   *     * {@link String } value).
   *     * Please note that when compaction is performed, the most compact character encoding is chosen
   *     * for characters in the input that are not in the ISO-8859-1 character set. Based on experience,
   *     * some scanners do not support encodings like cp-1256 (Arabic). In such cases the encoding can
   *     * be forced to UTF-8 by means of the {@link #CHARACTER_SET} encoding hint.
   *
   */
  QrCompact: 14,
  14: "QrCompact",
  /**
   *
   *     * Specifies whether the data should be encoded to the GS1 standard (type {@link Boolean}, or "true" or "false"
   *     * {@link String } value).
   *
   */
  Gs1Format: 15,
  15: "Gs1Format",
  /**
   *
   *     * Forces which encoding will be used. Currently only used for Code-128 code sets (Type {@link String}).
   *     * Valid values are "A", "B", "C".
   *     * This option and {@link #CODE128_COMPACT} are mutually exclusive.
   *
   */
  ForceCodeSet: 16,
  16: "ForceCodeSet",
  /**
   *
   *     * Forces C40 encoding for data-matrix (type {@link Boolean}, or "true" or "false") {@link String } value). This
   *     * option and {@link #DATA_MATRIX_COMPACT} are mutually exclusive.
   *
   */
  ForceC40: 17,
  17: "ForceC40",
  /**
   *
   *     * Specifies whether to use compact mode for Code-128 code (type {@link Boolean}, or "true" or "false"
   *     * {@link String } value).
   *     * This can yield slightly smaller bar codes. This option and {@link #FORCE_CODE_SET} are mutually
   *     * exclusive.
   *
   */
  Code128Compact: 18,
  18: "Code128Compact",
  TelepenAsNumeric: 19,
  19: "TelepenAsNumeric",
});
/**
 */
export const DecodeHintTypes = Object.freeze({
  /**
   *
   *     * Unspecified, application-specific hint. Maps to an unspecified {@link Object}.
   *
   */
  Other: 0,
  0: "Other",
  /**
   *
   *     * Image is a pure monochrome image of a barcode. Doesn't matter what it maps to;
   *     * use {@link Boolean#TRUE}.
   *
   */
  PureBarcode: 1,
  1: "PureBarcode",
  /**
   *
   *     * Image is known to be of one of a few possible formats.
   *     * Maps to a {@link List} of {@link BarcodeFormat}s.
   *
   */
  PossibleFormats: 2,
  2: "PossibleFormats",
  /**
   *
   *     * Spend more time to try to find a barcode; optimize for accuracy, not speed.
   *     * Doesn't matter what it maps to; use {@link Boolean#TRUE}.
   *
   */
  TryHarder: 3,
  3: "TryHarder",
  /**
   *
   *     * Specifies what character encoding to use when decoding, where applicable (type String)
   *
   */
  CharacterSet: 4,
  4: "CharacterSet",
  /**
   *
   *     * Allowed lengths of encoded data -- reject anything else. Maps to an {@code int[]}.
   *
   */
  AllowedLengths: 5,
  5: "AllowedLengths",
  /**
   *
   *     * Assume Code 39 codes employ a check digit. Doesn't matter what it maps to;
   *     * use {@link Boolean#TRUE}.
   *
   */
  AssumeCode39CheckDigit: 6,
  6: "AssumeCode39CheckDigit",
  /**
   *
   *     * Assume the barcode is being processed as a GS1 barcode, and modify behavior as needed.
   *     * For example this affects FNC1 handling for Code 128 (aka GS1-128). Doesn't matter what it maps to;
   *     * use {@link Boolean#TRUE}.
   *
   */
  AssumeGs1: 7,
  7: "AssumeGs1",
  /**
   *
   *     * If true, return the start and end digits in a Codabar barcode instead of stripping them. They
   *     * are alpha, whereas the rest are numeric. By default, they are stripped, but this causes them
   *     * to not be. Doesn't matter what it maps to; use {@link Boolean#TRUE}.
   *
   */
  ReturnCodabarStartEnd: 8,
  8: "ReturnCodabarStartEnd",
  /**
   *
   *     * The caller needs to be notified via callback when a possible {@link RXingResultPoint}
   *     * is found. Maps to a {@link RXingResultPointCallback}.
   *
   */
  NeedResultPointCallback: 9,
  9: "NeedResultPointCallback",
  /**
   *
   *     * Allowed extension lengths for EAN or UPC barcodes. Other formats will ignore this.
   *     * Maps to an {@code int[]} of the allowed extension lengths, for example [2], [5], or [2, 5].
   *     * If it is optional to have an extension, do not set this hint. If this is set,
   *     * and a UPC or EAN barcode is found but an extension is not, then no result will be returned
   *     * at all.
   *
   */
  AllowedEanExtensions: 10,
  10: "AllowedEanExtensions",
  /**
   *
   *     * If true, also tries to decode as inverted image. All configured decoders are simply called a
   *     * second time with an inverted image. Doesn't matter what it maps to; use {@link Boolean#TRUE}.
   *
   */
  AlsoInverted: 11,
  11: "AlsoInverted",
  /**
   *
   *     * Translate the ASCII values parsed by the Telepen reader into the Telepen Numeric form; use {@link Boolean#TRUE}.
   *
   */
  TelepenAsNumeric: 12,
  12: "TelepenAsNumeric",
});
/**
 * Available barcode types
 */
export const BarcodeFormat = Object.freeze({
  /**
   * Aztec 2D barcode format.
   */
  AZTEC: 0,
  0: "AZTEC",
  /**
   * CODABAR 1D format.
   */
  CODABAR: 1,
  1: "CODABAR",
  /**
   * Code 39 1D format.
   */
  Code39: 2,
  2: "Code39",
  /**
   * Code 93 1D format.
   */
  Code93: 3,
  3: "Code93",
  /**
   * Code 128 1D format.
   */
  Code128: 4,
  4: "Code128",
  /**
   * Data Matrix 2D barcode format.
   */
  DataMatrix: 5,
  5: "DataMatrix",
  /**
   * EAN-8 1D format.
   */
  Ean8: 6,
  6: "Ean8",
  /**
   * EAN-13 1D format.
   */
  Ean13: 7,
  7: "Ean13",
  /**
   * ITF (Interleaved Two of Five) 1D format.
   */
  ITF: 8,
  8: "ITF",
  /**
   * MaxiCode 2D barcode format.
   */
  MAXICODE: 9,
  9: "MAXICODE",
  /**
   * PDF417 format.
   */
  Pdf417: 10,
  10: "Pdf417",
  /**
   * QR Code 2D barcode format.
   */
  QrCode: 11,
  11: "QrCode",
  /**
   * RSS 14
   */
  Rss14: 12,
  12: "Rss14",
  /**
   * RSS EXPANDED
   */
  RssExpanded: 13,
  13: "RssExpanded",
  /**
   * UPC-A 1D format.
   */
  UpcA: 14,
  14: "UpcA",
  /**
   * UPC-E 1D format.
   */
  UpcE: 15,
  15: "UpcE",
  /**
   * UPC/EAN extension format. Not a stand-alone format.
   */
  UpcEanExtension: 16,
  16: "UpcEanExtension",
  MicroQR: 17,
  17: "MicroQR",
  Telepen: 18,
  18: "Telepen",
  RectangularMicroQR: 19,
  19: "RectangularMicroQR",
  UnsuportedFormat: 20,
  20: "UnsuportedFormat",
});

const BarcodeResultFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_barcoderesult_free(ptr >>> 0));
/**
 */
export class BarcodeResult {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(BarcodeResult.prototype);
    obj.__wbg_ptr = ptr;
    BarcodeResultFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    BarcodeResultFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_barcoderesult_free(ptr);
  }
  /**
   * @returns {number}
   */
  timestamp() {
    const ret = wasm.barcoderesult_timestamp(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {BarcodeFormat}
   */
  format() {
    const ret = wasm.barcoderesult_format(this.__wbg_ptr);
    return ret;
  }
  /**
   * Each pair of f32 values is an (x,y) point
   * @returns {Float32Array}
   */
  result_points() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.barcoderesult_result_points(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayF32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 4, 4);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  num_bits() {
    const ret = wasm.barcoderesult_num_bits(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Uint8Array}
   */
  raw_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.barcoderesult_raw_bytes(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1, 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  text() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.barcoderesult_text(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {Map<any, any>}
   */
  get_meta_data() {
    const ret = wasm.barcoderesult_get_meta_data(this.__wbg_ptr);
    return takeObject(ret);
  }
}

const DecodeHintDictionaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_decodehintdictionary_free(ptr >>> 0));
/**
 */
export class DecodeHintDictionary {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DecodeHintDictionaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_decodehintdictionary_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.decodehintdictionary_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @param {DecodeHintTypes} hint
   * @returns {string}
   */
  get_hint(hint) {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.decodehintdictionary_get_hint(retptr, this.__wbg_ptr, hint);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {DecodeHintTypes} hint
   * @param {string} value
   * @returns {boolean}
   */
  set_hint(hint, value) {
    const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.decodehintdictionary_set_hint(this.__wbg_ptr, hint, ptr0, len0);
    return ret !== 0;
  }
  /**
   * @param {DecodeHintTypes} hint
   * @returns {boolean}
   */
  remove_hint(hint) {
    const ret = wasm.decodehintdictionary_remove_hint(this.__wbg_ptr, hint);
    return ret !== 0;
  }
}

const EncodeHintDictionaryFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_encodehintdictionary_free(ptr >>> 0));
/**
 */
export class EncodeHintDictionary {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    EncodeHintDictionaryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_encodehintdictionary_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.encodehintdictionary_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @param {EncodeHintTypes} hint
   * @returns {string}
   */
  get_hint(hint) {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.encodehintdictionary_get_hint(retptr, this.__wbg_ptr, hint);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {EncodeHintTypes} hint
   * @param {string} value
   * @returns {boolean}
   */
  set_hint(hint, value) {
    const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodehintdictionary_set_hint(this.__wbg_ptr, hint, ptr0, len0);
    return ret !== 0;
  }
  /**
   * @param {EncodeHintTypes} hint
   * @returns {boolean}
   */
  remove_hint(hint) {
    const ret = wasm.encodehintdictionary_remove_hint(this.__wbg_ptr, hint);
    return ret !== 0;
  }
}

const MultiDecodeResultFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_multidecoderesult_free(ptr >>> 0));
/**
 */
export class MultiDecodeResult {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(MultiDecodeResult.prototype);
    obj.__wbg_ptr = ptr;
    MultiDecodeResultFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    MultiDecodeResultFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_multidecoderesult_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.multidecoderesult_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @returns {BarcodeResult | undefined}
   */
  next() {
    const ret = wasm.multidecoderesult_next(this.__wbg_ptr);
    return ret === 0 ? undefined : BarcodeResult.__wrap(ret);
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e,
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_d1cc518eff6805bb = function () {
    const ret = new Map();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_e4cfc2763115ffc7 = function (arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_getTime_0e03c3f524be31ef = function (arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
  };
  imports.wbg.__wbg_new0_7a6141101f2206da = function () {
    const ret = new Date();
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  return imports;
}

function __wbg_init_memory(imports, maybe_memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedFloat32Memory0 = null;
  cachedInt32Memory0 = null;
  cachedUint32Memory0 = null;
  cachedUint8Memory0 = null;

  return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
  if (wasm !== undefined) return wasm;

  if (typeof input === "undefined") {
    input = new URL("rxing_wasm_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof input === "string" ||
    (typeof Request === "function" && input instanceof Request) ||
    (typeof URL === "function" && input instanceof URL)
  ) {
    input = fetch(input);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await input, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
