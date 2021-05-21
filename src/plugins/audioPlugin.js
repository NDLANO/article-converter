/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import {
  Figure,
  FigureLicenseDialog,
  FigureCaption,
} from '@ndla/ui/lib/Figure';
import Button, { StyledButton } from '@ndla/button';
import AudioPlayer from '@ndla/ui/lib/AudioPlayer';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import t from '../locale/i18n';
import { getCopyString, getLicenseCredits } from './pluginHelpers';
import { fetchAudio } from '../api/audioApi';
import { render } from '../utils/render';

const Anchor = StyledButton.withComponent('a');

export default function createAudioPlugin(options = {}) {
  const fetchResource = (embed, accessToken, language) =>
    fetchAudio(embed, accessToken, language);

  const getMetaData = (embed, locale) => {
    const { audio } = embed;
    if (audio) {
      const {
        title: { title },
        copyright,
        audioFile: { url },
      } = audio;
      const copyString = getCopyString(
        title,
        url,
        options.path,
        copyright,
        locale
      );
      return {
        title: audio.title.title,
        copyright: audio.copyright,
        src: audio.audioFile.url,
        copyText: copyString,
      };
    }
  };

  const renderMarkdown = text => {
    const md = new Remarkable();
    const rendered = md.render(text);
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  const onError = ({ audio }, locale) => {
    const { audioFile: { mimeType, url } = {} } = audio || {};
    return render(
      <Figure>
        {audio ? (
          <AudioPlayer type={mimeType} src={url} />
        ) : (
          <svg
            fill="#8A8888"
            height="50"
            viewBox="0 0 24 12"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 'background-color': '#EFF0F2' }}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              transform="scale(0.3) translate(28, 8.5)"
              d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            />
          </svg>
        )}
        <figcaption>{t(locale, 'audio.error.caption')}</figcaption>
      </Figure>
    );
  };

  const AudioActionButtons = ({ copyString, locale, license, src }) => {
    const buttons = [
      <Button
        key="copy"
        outline
        data-copied-title={t(locale, 'license.hasCopiedTitle')}
        data-copy-string={copyString}>
        {t(locale, 'license.copyTitle')}
      </Button>,
    ];
    if (license !== 'COPYRIGHTED') {
      buttons.push(
        <Anchor key="download" href={src} download appearance="outline">
          {t(locale, 'audio.download')}
        </Anchor>
      );
    }
    return buttons;
  };

  AudioActionButtons.propTypes = {
    copyString: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  };

  const embedToHTML = ({ audio, data }, locale) => {
    const {
      id,
      title: { title },
      audioFile: { mimeType, url },
      manuscript,
      podcastMeta,
      copyright: {
        license: { license: licenseAbbreviation },
        origin,
      },
    } = audio;

    const { introduction, coverPhoto } = podcastMeta || {};

    const textVersion =
      manuscript?.manuscript && renderMarkdown(manuscript.manuscript);
    const description = renderMarkdown(introduction);

    const img = coverPhoto && { url: coverPhoto.url, alt: coverPhoto.altText };

    const caption = data.caption || title;

    const authors = getLicenseCredits(audio.copyright);

    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const contributors = getGroupedContributorDescriptionList(
      audio.copyright,
      locale
    ).map(item => ({
      name: item.description,
      type: item.label,
    }));

    const figureLicenseDialogId = `audio-${id}`;
    const figureid = `figure-${id}`;
    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'license.audio.rules'),
      learnAboutLicenses: t(locale, 'license.learnMore'),
      source: t(locale, 'source'),
    };

    const copyString = getCopyString(
      title,
      url,
      options.path,
      audio.copyright,
      locale
    );
    return render(
      data.type === 'minimal' ? (
        <AudioPlayer speech type={mimeType} src={url} title={title} />
      ) : (
        <Figure id={figureid} type="full">
          <AudioPlayer
            description={description}
            img={img}
            src={url}
            textVersion={textVersion}
            title={title}
            staticRenderId={`static-render-${id}-${locale}`}
          />
          <FigureCaption
            figureId={figureid}
            id={figureLicenseDialogId}
            caption={caption}
            reuseLabel={t(locale, 'audio.reuse')}
            licenseRights={license.rights}
            authors={
              authors.creators || authors.rightsholders || authors.processors
            }
            locale={locale}
          />
          <FigureLicenseDialog
            id={figureLicenseDialogId}
            title={title}
            license={license}
            authors={contributors}
            origin={origin}
            locale={locale}
            messages={messages}>
            <AudioActionButtons
              copyString={copyString}
              locale={locale}
              license={licenseAbbreviation}
              src={url}
            />
          </FigureLicenseDialog>
        </Figure>
      )
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
