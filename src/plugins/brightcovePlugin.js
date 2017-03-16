/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


export default function createBrightcovePlugin() {
  const createEmbedObject = obj => (
      { id: parseInt(obj.id, 10), resource: obj.resource, account: parseInt(obj.account, 10), caption: obj.caption, player: obj.player, videoid: obj.videoid }
  );

  const embedToHTML = (embed) => {
    const { account, player, videoid, caption } = embed;
    const figcaption = caption ? `<figurecaption class="article_caption">${caption}</figurecaption>` : '';
    return `
    <figure>
      <div style="display:block;position:relative;max-width:100%;">
        <div style="padding-top:56.25%;">
          <video
            style="width:100%;height:100%;position:absolute;top:0px;bottom:0px;right:0px;left:0px;"
            data-video-id="${videoid}" data-account="${account}" data-player="${player}" data-embed="default" class="video-js" controls="">
          </video>
        </div>
      </div>
      ${figcaption}
    </figure>`;
  };

  return {
    resource: 'brightcove',
    createEmbedObject,
    embedToHTML,
  };
}
