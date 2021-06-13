import * as Utils from "../utils";
import ImageManager from "./ImageManager";
export default class Bitmap {
  _id: string;
  _url: string;
  _x: number;
  _y: number;
  _width: number;
  _height: number;
  _file: string;
  _gammagroup: string;

  setXmlAttributes(attributes: { [attrName: string]: string }) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setXmlAttr(key, value);
    }
  }

  setXmlAttr(key: string, value: string) {
    switch (key) {
      case "id":
        this._id = value;
        break;
      case "x":
        this._x = Utils.num(value) ?? 0;
        break;
      case "y":
        this._y = Utils.num(value) ?? 0;
        break;
      case "w":
        this._width = Utils.num(value);
        break;
      case "h":
        this._height = Utils.num(value);
        break;
      case "file":
        this._file = value;
      case "gammagroup":
        this._gammagroup = value;
        break;
      default:
        console.log({ key });
    }
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  setUrl(url: string) {
    this._url = url;
  }

  // Ensure we've loaded the image into our image loader.
  async ensureImageLoaded(imageManager: ImageManager) {
    Utils.assert(
      this._url == null,
      "Tried to ensure a Bitmap was laoded more than once."
    );
    const imgUrl = await imageManager.getUrl(this._file);

    if (this._width == null && this._height == null) {
      const size = await imageManager.getSize(imgUrl);
      this.setXmlAttr("w", String(size.width));
      this.setXmlAttr("h", String(size.height));
    }

    this.setUrl(imgUrl);
  }

  getBackgrondCSSAttribute(): string {
    const width = Utils.px(this._width);
    const height = Utils.px(this._height);
    return `url(${this._url}) ${width} ${height}`;
  }
}