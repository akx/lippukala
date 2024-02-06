/* eslint-disable max-classes-per-file */

/* globals BarcodeDetector */

class PosQRNative {
  constructor() {
    this.barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
  }

  async init() {
    return Boolean(this.barcodeDetector);
  }

  async detectFromVideo(video) {
    return this.barcodeDetector.detect(video);
  }
}

class PosQRRxing {
  constructor(width) {
    this.width = width;
    this.rxing = null;
  }

  async init() {
    // Find out where we were loaded from to load the rest from the same place
    // eslint-disable-next-line no-restricted-globals
    const qrScriptURL = new URL(document.getElementById("qr-script").src, location.href);
    const root = qrScriptURL.href.replace(/\/[^/]+$/, "");

    // eslint-disable-next-line no-restricted-globals
    const wasmURL = new URL(`${root}/rxing_qr_wasm_bg.wasm`, location.href);
    const rxingMod = await import(`${root}/rxing_qr_wasm.js`);
    await rxingMod.default(wasmURL); // fetch wasm and initialize in module
    this.rxing = rxingMod;
    const canvas = document.createElement("canvas");
    canvas.id = "posqr-canvas";
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { willReadFrequently: true });
  }

  async detectFromVideo(video) {
    const { canvas, width, rxing } = this;
    if (!rxing) {
      throw new Error("Rxing not initialized");
    }
    const height = width * (video.videoHeight / video.videoWidth);
    canvas.width = width;
    canvas.height = height;
    this.context.drawImage(video, 0, 0, width, height);
    const imageData = this.context.getImageData(0, 0, width, height);
    try {
      const luma8Data = rxing.convert_js_image_to_luma(imageData.data);
      const parsedText = rxing.decode_qrcode_text(luma8Data, imageData.width, imageData.height);
      return [{ rawValue: parsedText }];
    } catch (err) {
      if (String(err) === "NotFoundException") {
        return [];
      }
      throw err;
    }
  }
}

class PosQR {
  static hasBarcodeDetector() {
    return typeof BarcodeDetector !== "undefined";
  }

  constructor({ addLogEntry, onFoundQRCode }) {
    this.addLogEntry = addLogEntry;
    this.onFoundQRCode = onFoundQRCode;

    const video = document.createElement("video");
    video.id = "posqr-video";
    document.body.appendChild(video);

    this.video = video;
    this.detecting = false;
    this.detector = null;
    this.interval = null;
    this.media = null;
  }

  async init() {
    if (PosQR.hasBarcodeDetector()) {
      this.addLogEntry("Käytetään sisäänrakennettua QR-koodinlukijaa");
      this.detector = new PosQRNative();
    } else {
      this.addLogEntry("Ladataan Rxing-QR-koodinlukijaa...");
      this.detector = new PosQRRxing(480);
    }
    await this.detector.init();
    this.addLogEntry("QR-koodinlukija valmis");
  }

  updateDOM() {
    const started = this.isStarted();
    document.body.classList.toggle("qr-started", started);
  }

  isStarted() {
    return Boolean(this.media) && Boolean(this.interval);
  }

  isInitialized() {
    return Boolean(this.detector);
  }

  async doDetectQR() {
    const { video } = this;
    try {
      if (this.detecting) {
        console.warn("Already detecting");
        return;
      }
      this.detecting = true;
      const t0 = performance.now();
      for (const barcode of await this.detector.detectFromVideo(video)) {
        this.onFoundQRCode(barcode);
      }
      const t1 = performance.now();
      console.debug("QR detect time", Math.round(t1 - t0));
    } finally {
      this.detecting = false;
    }
  }

  async start() {
    if (!this.isInitialized()) await this.init();
    await this.stop();
    try {
      this.media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          frameRate: { ideal: 10 },
        },
        audio: false,
      });
      this.video.srcObject = this.media;
      await this.video.play();
      this.addLogEntry("Kamera käynnistetty");
      this.interval = setInterval(() => this.doDetectQR(), 300);
    } catch (err) {
      this.addLogEntry(`QR-koodinlukijan käynnistäminen epäonnistui: ${err}`);
    }
    this.updateDOM();
  }

  async stop() {
    if (this.media) {
      for (const track of this.media.getTracks()) {
        track.stop();
      }
      this.media = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.updateDOM();
  }
}

window.PosQR = PosQR;
