"use strict";

const isVideo = (chunk) => {
    // https://en.wikipedia.org/wiki/List_of_file_signatures
    const types = [
        {
            ext: "mp4",
            mime: "video/webm",
            bytes: [0x1a, 0x45, 0xdf, 0xa3],// 1A 45 DF A3
        },
    ];
    for (const type of types) {
        let valid = true;
        for (let i = 0; i < type.bytes.length; i++) {
            const byte = type.bytes[i];
            if (chunk[i] !== byte) {
                valid = false;
                break;
            }
        }
        if (valid) return valid;
    }
    return false;
};

module.exports = isVideo;