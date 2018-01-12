/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Figure, FigureLicenseDialog, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import AudioPlayer from 'ndla-ui/lib/AudioPlayer';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from 'ndla-licenses';
import t from '../locale/i18n';
import { getCopyString } from './pluginHelpers';
import { fetchAudio } from '../api/audioApi';

export default function createAudioPlugin() {
  const fetchResource = (embed, headers) => fetchAudio(embed, headers);

  const getMetaData = embed => {
    const { audio } = embed;
    return {
      title: audio.title.title,
      copyright: audio.copyright,
      src: audio.audioFile.url,
    };
  };

  const onError = ({ audio }, locale) => {
    const { audioFile: { mimeType, url } = {} } = audio || {};
    return renderToStaticMarkup(
      <Figure>
        {audio ? (
          <AudioPlayer type={mimeType} src={url} />
        ) : (
          <AudioPlayer disabled />
        )}
        <figcaption>{t(locale, 'audio.error.caption')}</figcaption>
      </Figure>
    );
  };

  const AudioActionButtons = ({ locale, src, copyString }) => [
    <Button
      key="copy"
      outline
      data-copied-title={t(locale, 'reference.copied')}
      data-copy-string={copyString}>
      {t(locale, 'reference.copy')}
    </Button>,
    <a
      key="download"
      href={src}
      className="c-button c-button--outline"
      download>
      {t(locale, 'audio.download')}
    </a>,
  ];

  AudioActionButtons.propTypes = {
    locale: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    copyString: PropTypes.string.isRequired,
  };

  const embedToHTML = ({ audio }, locale) => {
    const {
      id,
      title: { title },
      audioFile: { mimeType, url },
      copyright: {
        creators,
        license: { license: licenseAbbreviation },
        origin,
      },
    } = audio;

    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const contributors = getGroupedContributorDescriptionList(
      audio.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));

    const figureLicenseDialogId = `audio-${id}`;
    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'audio.rulesForUse'),
      learnAboutLicenses: t(locale, 'learnAboutLicenses'),
      source: t(locale, 'source'),
    };
    return renderToStaticMarkup(
      <Figure>
        <AudioPlayer type={mimeType} src={url} />
        <FigureCaption
          id={figureLicenseDialogId}
          caption={title}
          reuseLabel={t(locale, 'audio.reuse')}
          licenseRights={license.rights}
          authors={creators}
        />
        <FigureLicenseDialog
          id={figureLicenseDialogId}
          title={title}
          licenseRights={license.rights}
          licenseUrl={license.url}
          authors={contributors}
          origin={origin}
          messages={messages}>
          <AudioActionButtons
            locale={locale}
            copyString={getCopyString(licenseAbbreviation, creators, locale)}
            src={url}
          />
        </FigureLicenseDialog>
      </Figure>
    );
  };

  return {
    resource: 'audio',
    onError,
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
