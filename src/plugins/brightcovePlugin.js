/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/media-has-caption */

import {
  Figure,
  FigureDetails,
  FigureCaption,
} from 'ndla-ui/lib/article/Figure';
import Icon from 'ndla-ui/lib/icons/Icon';
import React from 'react';
import ReactDOMServerStream from 'react-dom/server';
import { fetchVideoMeta } from '../api/brightcove';

export default function createBrightcovePlugin() {
  const getLicenseByNBTitle = title => {
    switch (title) {
      case 'Navngivelse-IkkeKommersiell-IngenBearbeidelser':
        return 'by-nc-nd';
      case 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår':
        return 'by-nc-sa';
      case 'Navngivelse-IkkeKommersiell':
        return 'by-nc';
      case 'Navngivelse-IngenBearbeidelse':
        return 'by-nd';
      case 'Navngivelse-DelPåSammeVilkår':
        return 'by-sa';
      case 'Navngivelse':
        return 'by';
      default:
        return title;
    }
  };

  const createEmbedObject = obj => ({
    id: parseInt(obj.id, 10),
    resource: obj.resource,
    account: parseInt(obj.account, 10),
    caption: obj.caption,
    player: obj.player,
    videoid: obj.videoid,
  });

  const fetchResource = embed => fetchVideoMeta(embed);

  const embedToHTML = embed => {
    const { account, player, videoid, caption, video } = embed;

    const parseAuthorString = authorString => {
      const fields = authorString.split(/: */);
      if (fields.length !== 2) return { type: '', name: fields[0] };

      const [type, name] = fields;
      return { type, name };
    };
    const licenseInfoKeys = Object.keys(video.custom_fields).filter(key =>
      key.startsWith('licenseinfo')
    );

    const authors = licenseInfoKeys.map(key =>
      parseAuthorString(video.custom_fields[key])
    );
    const license = getLicenseByNBTitle(
      video.custom_fields.license.replace(/\s/g, '')
    );

    return ReactDOMServerStream.renderToStaticMarkup(
      <Figure>
        <div
          style={{
            display: 'block',
            position: 'relative',
            maxWidth: '100%',
          }}>
          <div style={{ paddingTop: '56.25%' }}>
            <video
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                bottom: '0px',
                right: '0px',
                left: '0px',
              }}
              data-video-id={videoid}
              data-account={account}
              data-player={player}
              data-embed="default"
              className="video-js"
              controls
            />
          </div>
        </div>
        <FigureCaption
          caption={caption}
          reuseLabel="Gjenbruk"
          licenseAbbreviation={license}
          authors={authors}
        />
        <FigureDetails licenseAbbreviation={license} authors={authors}>
          <button
            className="c-button c-button--small c-button--transparent c-licenseToggle__button"
            type="button">
            <Icon.Copy /> Kopier referanse
          </button>
          <button className="c-button c-licenseToggle__button" type="button">
            <Icon.OpenWindow /> Last ned video
          </button>
        </FigureDetails>
      </Figure>
    );
  };

  return {
    resource: 'brightcove',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
