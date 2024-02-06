class PosQR {
  constructor({ addLogEntry, onFoundQRCode }) {
    this.addLogEntry = addLogEntry;
    this.onFoundQRCode = onFoundQRCode;

    const canvas = document.createElement("canvas");
    canvas.id = "posqr-canvas";
    document.body.appendChild(canvas);
    const video = document.createElement("video");
    document.body.appendChild(video);
    video.id = "posqr-video";

    this.canvas = canvas;
    this.context = canvas.getContext("2d", { willReadFrequently: true });
    this.video = video;
    this.rxingP = this.importRxing();
    this.detecting = false;
    this.interval = null;
    this.media = null;
    this.hints = null;
  }

  updateDOM() {
    const { video, canvas } = this;
    const started = this.isStarted();
    video.classList.toggle("started", started);
    canvas.classList.toggle("started", started);
  }

  isStarted() {
    return Boolean(this.media) && Boolean(this.interval);
  }

  async importRxing() {
    this.addLogEntry("Ladataan QR-koodinlukijaa...");
    const root = "/static/lippukala";
    // eslint-disable-next-line no-restricted-globals
    const wasmURL = new URL(`${root}/rxing_wasm_bg.wasm`, location.href);
    const rxingMod = await import(`${root}/rxing_wasm.js`);
    await rxingMod.default(wasmURL); // fetch wasm and initialize
    this.addLogEntry("QR-koodinlukija ladattu");
    return rxingMod; // .. but return the wrapper module!!
  }

  async doDetectQR() {
    const { video, canvas, rxingP } = this;
    try {
      if (this.detecting) {
        console.warn("Already detecting");
        return;
      }
      this.detecting = true;
      const t0 = performance.now();
      const w = 320;
      const h = w * (video.videoHeight / video.videoWidth);
      canvas.width = w;
      canvas.height = h;
      const { width, height } = canvas;
      this.context.drawImage(video, 0, 0, width, height);
      const imageData = this.context.getImageData(0, 0, width, height);
      try {
        // eslint-disable-next-line camelcase
        const { convert_js_image_to_luma, decode_barcode_with_hints, DecodeHintDictionary, DecodeHintTypes } =
          await rxingP;
        if (!this.hints) {
          this.hints = new DecodeHintDictionary();
          // Yes, hints are strings, not booleans
          this.hints.set_hint(DecodeHintTypes.TryHarder, "false");
          this.hints.set_hint(DecodeHintTypes.PossibleFormats, "qrcode");
        }
        const luma8Data = convert_js_image_to_luma(imageData.data);
        const parsedBarcode = decode_barcode_with_hints(luma8Data, imageData.width, imageData.height, this.hints);
        this.onFoundQRCode(parsedBarcode);
      } catch (err) {
        if (String(err) !== "not found") {
          console.error(err);
        }
      }
      const t1 = performance.now();
      console.debug("Read", imageData.width, imageData.height, Math.round(t1 - t0));
    } finally {
      this.detecting = false;
    }
  }

  async start() {
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
      this.interval = setInterval(() => this.doDetectQR(), 333);
    } catch (err) {
      this.addLogEntry(`QR-koodinlukijan käynnistäminen epäonnistui: ${err}`);
    }
    this.updateDOM();
  }

  async stop() {
    if (this.media) {
      this.media.getTracks().forEach((track) => track.stop());
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
