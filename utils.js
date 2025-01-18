/* eslint-disable no-prototype-builtins */
"use strict";

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
function randomUserAgent() {
    const platform = {
    platform: ['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 14.7; rv:132.0'],
    browsers: {
        chrome: ['122.0.0.0', '121.0.0.0'],
        firefox: ['123.0', '122.0'],
        edge: ['122.0.2365.92']
       }
    };
    const browserName = getRandom(Object.keys(platform.browsers));
    const version = getRandom(platform.browsers[browserName]);
    const plat = getRandom(platform.platform);
    const userAgentArray = [
          defaultUserAgent,
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:45.0) Gecko/20100101 Firefox/45.0",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.3",
    ];
    const ua = getRandom([
    browserName === 'firefox' ? `Mozilla/5.0 (${plat}) Gecko/20100101 Firefox/${version}` : `Mozilla/5.0 (${plat}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`,
    getRandom(userAgentArray)
    ]);
    return ua;
}
const defaultUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:132.0) Gecko/20100101 Firefox/132.0";
const headers = {
  "content-type": "application/x-www-form-urlencoded",
  "referer": "https://www.facebook.com/",
  "origin": "https://www.facebook.com",
  "connection": "keep-alive",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "User-Agent": defaultUserAgent
};
let request = require("request").defaults({
  jar: true
});
const stream = require("stream");
const querystring = require("querystring");
const url = require("url");

function setProxy(proxy) {
  request = require("request").defaults({
    jar: true,
    ...(proxy && {
      proxy
    })
  });
  return;
}

function getHeaders(url, options, ctx, customHeader) {
  const headers1 = {
    "host": new URL(url).hostname,
    ...headers
  }
  if (headers1["User-Agent"]) {
    delete headers1["User-Agent"];
    headers1["User-Agent"] = customHeader?.customUserAgent ?? options?.userAgent ?? defaultUserAgent;
  }
  if (ctx && ctx.region) headers1["X-MSGR-Region"] = ctx.region;
  if (customHeader) {
    Object.assign(headers1, customHeader);
    if (customHeader.noRef) delete headers1.referer;
  }
  return headers1;
}


function isReadableStream(obj) {
  return obj instanceof stream.Stream && typeof obj._read == "function" && getType(obj._readableState) == "Object";
}

function get(url, jar, qs, options, ctx, customHeader) {
	let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
	if (getType(qs) == "Object") 
    for (let prop in qs) {
      if (getType(qs[prop]) == 'Object')
        qs[prop] = JSON.stringify(qs[prop]);
    }
	var op = {
    headers: getHeaders(url, options, ctx, customHeader),
		timeout: 60000,
		qs,
		jar,
		gzip: true
	}

  request.get(url, op, callback);

  return returnPromise;
}

function post(url, jar, form, options, ctx, customHeader) {
  let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
  
	var op = {
    headers: getHeaders(url, options, ctx, customHeader),
    timeout: 60000,
		form,
		jar,
		gzip: true
	}

  request.post(url, op, callback);

	return returnPromise;
}

function postFormData(url, jar, form, qs, options, ctx) {
  let callback;
  var returnPromise = new Promise(function (resolve, reject) {
    callback = (error, res) => error ? reject(error) : resolve(res);
  });
  if (getType(qs) == "Object") 
    for (let prop in qs) {
      if (getType(qs[prop]) == 'Object')
        qs[prop] = JSON.stringify(qs[prop]);
    }
	var op = {
		headers: getHeaders(url, options, ctx, {
      'content-type': 'multipart/form-data'
    }),
		timeout: 60000,
		formData: form,
		qs,
		jar,
		gzip: true
	}

  request.post(url, op, callback);

	return returnPromise;
}


function padZeros(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) val = "0" + val;
  return val;
}

function generateThreadingID(clientID) {
  const k = Date.now();
  const l = Math.floor(Math.random() * 4294967295);
  const m = clientID;
  return "<" + k + ":" + l + "-" + m + "@mail.projektitan.com>";
}

function binaryToDecimal(data) {
  let ret = "";
  while (data !== "0") {
    let end = 0;
    let fullName = "";
    let i = 0;
    for (; i < data.length; i++) {
      end = 2 * end + parseInt(data[i], 10);
      if (end >= 10) {
        fullName += "1";
        end -= 10;
      }
      else {
        fullName += "0";
      }
    }
    ret = end.toString() + ret;
    data = fullName.slice(fullName.indexOf("1"));
  }
  return ret;
}

function generateOfflineThreadingID() {
  const ret = Date.now();
  const value = Math.floor(Math.random() * 4294967295);
  const str = ("0000000000000000000000" + value.toString(2)).slice(-22);
  const msgs = ret.toString(2) + str;
  return binaryToDecimal(msgs);
}

let h;
const i = {};
const j = {
  _: "%",
  A: "%2",
  B: "000",
  C: "%7d",
  D: "%7b%22",
  E: "%2c%22",
  F: "%22%3a",
  G: "%2c%22ut%22%3a1",
  H: "%2c%22bls%22%3a",
  I: "%2c%22n%22%3a%22%",
  J: "%22%3a%7b%22i%22%3a0%7d",
  K: "%2c%22pt%22%3a0%2c%22vis%22%3a",
  L: "%2c%22ch%22%3a%7b%22h%22%3a%22",
  M: "%7b%22v%22%3a2%2c%22time%22%3a1",
  N: ".channel%22%2c%22sub%22%3a%5b",
  O: "%2c%22sb%22%3a1%2c%22t%22%3a%5b",
  P: "%2c%22ud%22%3a100%2c%22lc%22%3a0",
  Q: "%5d%2c%22f%22%3anull%2c%22uct%22%3a",
  R: ".channel%22%2c%22sub%22%3a%5b1%5d",
  S: "%22%2c%22m%22%3a0%7d%2c%7b%22i%22%3a",
  T: "%2c%22blc%22%3a1%2c%22snd%22%3a1%2c%22ct%22%3a",
  U: "%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a",
  V: "%2c%22blc%22%3a0%2c%22snd%22%3a0%2c%22ct%22%3a",
  W: "%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a",
  X: "%2c%22ri%22%3a0%7d%2c%22state%22%3a%7b%22p%22%3a0%2c%22ut%22%3a1",
  Y: "%2c%22pt%22%3a0%2c%22vis%22%3a1%2c%22bls%22%3a0%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a",
  Z: "%2c%22sb%22%3a1%2c%22t%22%3a%5b%5d%2c%22f%22%3anull%2c%22uct%22%3a0%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a"
};
(function() {
  const l = [];
  for (const m in j) {
    i[j[m]] = m;
    l.push(j[m]);
  }
  l.reverse();
  h = new RegExp(l.join("|"), "g");
})();

function presenceEncode(str) {
  return encodeURIComponent(str)
    .replace(/([_A-Z])|%../g, function(m, n) {
      return n ? "%" + n.charCodeAt(0).toString(16) : m;
    })
    .toLowerCase()
    .replace(h, function(m) {
      return i[m];
    });
}

// eslint-disable-next-line no-unused-vars
function presenceDecode(str) {
  return decodeURIComponent(
    str.replace(/[_A-Z]/g, function(m) {
      return j[m];
    })
  );
}

function generatePresence(userID) {
  const time = Date.now();
  return (
    "E" +
    presenceEncode(
      JSON.stringify({
        v: 3,
        time: parseInt(time / 1000, 10),
        user: userID,
        state: {
          ut: 0,
          t2: [],
          lm2: null,
          uct2: time,
          tr: null,
          tw: Math.floor(Math.random() * 4294967295) + 1,
          at: time
        },
        ch: {
					["p_" + userID]: 0
        }
      })
    )
  );
}

function generateAccessiblityCookie() {
  const time = Date.now();
  return encodeURIComponent(
    JSON.stringify({
      sr: 0,
      "sr-ts": time,
      jk: 0,
      "jk-ts": time,
      kb: 0,
      "kb-ts": time,
      hcm: 0,
      "hcm-ts": time
    })
  );
}

function getGUID() {
  /** @type {number} */
  let sectionLength = Date.now();
  /** @type {string} */
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    /** @type {number} */
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    /** @type {number} */
    sectionLength = Math.floor(sectionLength / 16);
    /** @type {string} */
    const _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}

function getExtension(original_extension, fullFileName = "") {
  if (original_extension) {
    return original_extension;
  }
  else {
    const extension = fullFileName.split(".").pop();
    if (extension === fullFileName) {
      return "";
    }
    else {
      return extension;
    }
  }
}

function _formatAttachment(attachment1, attachment2) {
  // TODO: THIS IS REALLY BAD
  // This is an attempt at fixing Facebook's inconsistencies. Sometimes they give us
  // two attachment objects, but sometimes only one. They each contain part of the
  // data that you'd want so we merge them for convenience.
  // Instead of having a bunch of if statements guarding every access to image_data,
  // we set it to empty object and use the fact that it'll return undefined.
  const fullFileName = attachment1.filename;
  const fileSize = Number(attachment1.fileSize || 0);
  const durationVideo = attachment1.genericMetadata ? Number(attachment1.genericMetadata.videoLength) : undefined;
  const durationAudio = attachment1.genericMetadata ? Number(attachment1.genericMetadata.duration) : undefined;
  const mimeType = attachment1.mimeType;

  attachment2 = attachment2 || { id: "", image_data: {} };
  attachment1 = attachment1.mercury || attachment1;
  let blob = attachment1.blob_attachment || attachment1.sticker_attachment;
  let type =
    blob && blob.__typename ? blob.__typename : attachment1.attach_type;
  if (!type && attachment1.sticker_attachment) {
    type = "StickerAttachment";
    blob = attachment1.sticker_attachment;
  }
  else if (!type && attachment1.extensible_attachment) {
    if (
      attachment1.extensible_attachment.story_attachment &&
      attachment1.extensible_attachment.story_attachment.target &&
      attachment1.extensible_attachment.story_attachment.target.__typename &&
      attachment1.extensible_attachment.story_attachment.target.__typename === "MessageLocation"
    ) {
      type = "MessageLocation";
    }
    else {
      type = "ExtensibleAttachment";
    }

    blob = attachment1.extensible_attachment;
  }
  // TODO: Determine whether "sticker", "photo", "file" etc are still used
  // KEEP IN SYNC WITH getThreadHistory
  switch (type) {
    case "sticker":
      return {
        type: "sticker",
          ID: attachment1.metadata.stickerID.toString(),
          url: attachment1.url,

          packID: attachment1.metadata.packID.toString(),
          spriteUrl: attachment1.metadata.spriteURI,
          spriteUrl2x: attachment1.metadata.spriteURI2x,
          width: attachment1.metadata.width,
          height: attachment1.metadata.height,

          caption: attachment2.caption,
          description: attachment2.description,

          frameCount: attachment1.metadata.frameCount,
          frameRate: attachment1.metadata.frameRate,
          framesPerRow: attachment1.metadata.framesPerRow,
          framesPerCol: attachment1.metadata.framesPerCol,

          stickerID: attachment1.metadata.stickerID.toString(), // @Legacy
          spriteURI: attachment1.metadata.spriteURI, // @Legacy
          spriteURI2x: attachment1.metadata.spriteURI2x // @Legacy
      };
    case "file":
      return {
        type: "file",
          ID: attachment2.id.toString(),
          fullFileName: fullFileName,
          filename: attachment1.name,
          fileSize: fileSize,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          url: attachment1.url,

          isMalicious: attachment2.is_malicious,
          contentType: attachment2.mime_type,

          name: attachment1.name // @Legacy
      };
    case "photo":
      return {
        type: "photo",
          ID: attachment1.metadata.fbid.toString(),
          filename: attachment1.fileName,
          fullFileName: fullFileName,
          fileSize: fileSize,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          thumbnailUrl: attachment1.thumbnail_url,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          largePreviewUrl: attachment1.large_preview_url,
          largePreviewWidth: attachment1.large_preview_width,
          largePreviewHeight: attachment1.large_preview_height,

          url: attachment1.metadata.url, // @Legacy
          width: attachment1.metadata.dimensions.split(",")[0], // @Legacy
          height: attachment1.metadata.dimensions.split(",")[1], // @Legacy
          name: fullFileName // @Legacy
      };
    case "animated_image":
      return {
        type: "animated_image",
          ID: attachment2.id.toString(),
          filename: attachment2.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(attachment2.original_extension, fullFileName),
          mimeType: mimeType,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          url: attachment2.image_data.url,
          width: attachment2.image_data.width,
          height: attachment2.image_data.height,

          name: attachment1.name, // @Legacy
          facebookUrl: attachment1.url, // @Legacy
          thumbnailUrl: attachment1.thumbnail_url, // @Legacy
          rawGifImage: attachment2.image_data.raw_gif_image, // @Legacy
          rawWebpImage: attachment2.image_data.raw_webp_image, // @Legacy
          animatedGifUrl: attachment2.image_data.animated_gif_url, // @Legacy
          animatedGifPreviewUrl: attachment2.image_data.animated_gif_preview_url, // @Legacy
          animatedWebpUrl: attachment2.image_data.animated_webp_url, // @Legacy
          animatedWebpPreviewUrl: attachment2.image_data.animated_webp_preview_url // @Legacy
      };
    case "share":
      return {
        type: "share",
          ID: attachment1.share.share_id.toString(),
          url: attachment2.href,

          title: attachment1.share.title,
          description: attachment1.share.description,
          source: attachment1.share.source,

          image: attachment1.share.media.image,
          width: attachment1.share.media.image_size.width,
          height: attachment1.share.media.image_size.height,
          playable: attachment1.share.media.playable,
          duration: attachment1.share.media.duration,

          subattachments: attachment1.share.subattachments,
          properties: {},

          animatedImageSize: attachment1.share.media.animated_image_size, // @Legacy
          facebookUrl: attachment1.share.uri, // @Legacy
          target: attachment1.share.target, // @Legacy
          styleList: attachment1.share.style_list // @Legacy
      };
    case "video":
      return {
        type: "video",
          ID: attachment1.metadata.fbid.toString(),
          filename: attachment1.name,
          fullFileName: fullFileName,
          original_extension: getExtension(attachment1.original_extension, fullFileName),
          mimeType: mimeType,
          duration: durationVideo,

          previewUrl: attachment1.preview_url,
          previewWidth: attachment1.preview_width,
          previewHeight: attachment1.preview_height,

          url: attachment1.url,
          width: attachment1.metadata.dimensions.width,
          height: attachment1.metadata.dimensions.height,

          videoType: "unknown",

          thumbnailUrl: attachment1.thumbnail_url // @Legacy
      };
    case "error":
      return {
        type: "error",

          // Save error attachments because we're unsure of their format,
          // and whether there are cases they contain something useful for debugging.
          attachment1: attachment1,
          attachment2: attachment2
      };
    case "MessageImage":
      return {
        type: "photo",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          fileSize: fileSize,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,
          thumbnailUrl: blob.thumbnail.uri,

          previewUrl: blob.preview.uri,
          previewWidth: blob.preview.width,
          previewHeight: blob.preview.height,

          largePreviewUrl: blob.large_preview.uri,
          largePreviewWidth: blob.large_preview.width,
          largePreviewHeight: blob.large_preview.height,

          url: blob.large_preview.uri, // @Legacy
          width: blob.original_dimensions.x, // @Legacy
          height: blob.original_dimensions.y, // @Legacy
          name: blob.filename // @Legacy
      };
    case "MessageAnimatedImage":
      return {
        type: "animated_image",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,

          previewUrl: blob.preview_image.uri,
          previewWidth: blob.preview_image.width,
          previewHeight: blob.preview_image.height,

          url: blob.animated_image.uri,
          width: blob.animated_image.width,
          height: blob.animated_image.height,

          thumbnailUrl: blob.preview_image.uri, // @Legacy
          name: blob.filename, // @Legacy
          facebookUrl: blob.animated_image.uri, // @Legacy
          rawGifImage: blob.animated_image.uri, // @Legacy
          animatedGifUrl: blob.animated_image.uri, // @Legacy
          animatedGifPreviewUrl: blob.preview_image.uri, // @Legacy
          animatedWebpUrl: blob.animated_image.uri, // @Legacy
          animatedWebpPreviewUrl: blob.preview_image.uri // @Legacy
      };
    case "MessageVideo":
      return {
        type: "video",
          ID: blob.legacy_attachment_id,
          filename: blob.filename,
          fullFileName: fullFileName,
          original_extension: getExtension(blob.original_extension, fullFileName),
          fileSize: fileSize,
          duration: durationVideo,
          mimeType: mimeType,

          previewUrl: blob.large_image.uri,
          previewWidth: blob.large_image.width,
          previewHeight: blob.large_image.height,

          url: blob.playable_url,
          width: blob.original_dimensions.x,
          height: blob.original_dimensions.y,

          videoType: blob.video_type.toLowerCase(),

          thumbnailUrl: blob.large_image.uri // @Legacy
      };
    case "MessageAudio":
      return {
        type: "audio",
          ID: blob.url_shimhash,
          filename: blob.filename,
          fullFileName: fullFileName,
          fileSize: fileSize,
          duration: durationAudio,
          original_extension: getExtension(blob.original_extension, fullFileName),
          mimeType: mimeType,

          audioType: blob.audio_type,
          url: blob.playable_url,

          isVoiceMail: blob.is_voicemail
      };
    case "StickerAttachment":
    case "Sticker":
      return {
        type: "sticker",
          ID: blob.id,
          url: blob.url,

          packID: blob.pack ? blob.pack.id : null,
          spriteUrl: blob.sprite_image,
          spriteUrl2x: blob.sprite_image_2x,
          width: blob.width,
          height: 