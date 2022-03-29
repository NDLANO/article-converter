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
import { Translation } from 'react-i18next';
// @ts-ignore
import { Figure, FigureLicenseDialog, FigureCaption } from '@ndla/ui/lib/Figure';
// @ts-ignore
import Button, { StyledButton } from '@ndla/button';
import AudioPlayer from '@ndla/ui/lib/AudioPlayer';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
  figureApa7CopyString,
} from '@ndla/licenses';
import t from '../locale/i18n';
import { getFirstNonEmptyLicenseCredits, getLicenseCredits } from './pluginHelpers';
import { AudioApiCopyright, AudioApiType, fetchAudio } from '../api/audioApi';
import { render } from '../utils/render';
import { ImageActionButtons, messages } from './imagePlugin';
import { Plugin, Embed, LocaleType, TransformOptions, PlainEmbed } from '../interfaces';
import { fetchImageResources, ImageApiType } from '../api/imageApi';
import { apiResourceUrl } from '../utils/apiHelpers';
import config from '../config';

const Anchor = StyledButton.withComponent('a');

export interface AudioEmbed extends Embed<AudioEmbedData> {
  audio: AudioApiType;
  imageMeta?: ImageApiType;
}

export interface AudioPlugin extends Plugin<AudioEmbed, AudioEmbedData, AudioMetaData> {
  resource: 'audio';
}

export type AudioEmbedData = {
  resource: 'audio';
  resource_id: string;
  type: string;
  url: string;
};

export interface AudioMetaData {
  title: string;
  copyright: AudioApiCopyright;
  src: string;
  copyText: string | undefined;
}

export default function createAudioPlugin(options: TransformOptions = {}): AudioPlugin {
  const fetchResource = async (
    embed: PlainEmbed<AudioEmbedData>,
    accessToken: string,
    language: LocaleType,
  ) => {
    const result = await fetchAudio(embed, accessToken, language);

    if (result.audio.podcastMeta?.coverPhoto?.id) {
      const imageMeta = await fetchImageResources(
        apiResourceUrl(`/image-api/v2/images/${result.audio.podcastMeta.coverPhoto.id}`),
        accessToken,
        language,
      );

      return {
        ...result,
        imageMeta,
      };
    }

    return result;
  };

  const getMetaData = async (embed: AudioEmbed, locale: LocaleType) => {
    const { audio } = embed;
    if (audio) {
      const {
        title: { title },
        copyright,
        audioFile: { url },
      } = audio;
      const copyString =
        audio.audioType === 'podcast'
          ? figureApa7CopyString(
              title,
              undefined,
              url,
              options.shortPath || options.path,
              copyright,
              copyright.license.license,
              config.ndlaFrontendDomain,
              (id: string) => t(locale, id),
              locale,
            )
          : undefined;
      return {
        title: audio.title.title,
        copyright: audio.copyright,
        src: audio.audioFile.url,
        copyText: copyString,
      };
    }
  };

  const renderMarkdown = (text: string) => {
    const md = new Remarkable();
    const rendered = md.render(text);
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  const onError = (embed: AudioEmbed, locale: LocaleType) => {
    const audio = embed.audio;
    return render(
      <Figure>
        {audio ? (
          <AudioPlayer title={audio.title.title} src={audio.audioFile.url} />
        ) : (
          <svg
            fill="#8A8888"
            height="50"
            viewBox="0 0 24 12"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{ backgroundColor: '#EFF0F2' }}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              transform="scale(0.3) translate(28, 8.5)"
              d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            />
          </svg>
        )}
        <figcaption>{t(locale, 'audio.error.caption')}</figcaption>
      </Figure>,
    );
  };

  const AudioActionButtons = ({
    copyString,
    locale,
    license,
    src,
  }: {
    copyString?: string;
    locale: LocaleType;
    license: string;
    src: string;
  }) => {
    if (license === 'COPYRIGHTED') {
      return null;
    }
    return (
      <>
        {copyString && (
          <Button
            key="copy"
            outline
            data-copied-title={t(locale, 'license.hasCopiedTitle')}
            data-copy-string={copyString}>
            {t(locale, 'license.copyTitle')}
          </Button>
        )}
        <Anchor key="download" href={src} download appearance="outline">
          {t(locale, 'audio.download')}
        </Anchor>
      </>
    );
  };

  AudioActionButtons.propTypes = {
    copyString: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  };

  const ImageLicense = ({
    image,
    locale,
    figureid,
  }: {
    locale: LocaleType;
    image: ImageApiType;
    figureid: string;
  }) => {
    const {
      copyright,
      imageUrl,
      title: { title },
      id,
    } = image;
    const {
      license: { license: licenseAbbreviation },
      origin,
    } = copyright;
    const copyString = figureApa7CopyString(
      title,
      undefined,
      imageUrl,
      options.shortPath || options.path,
      copyright,
      copyright.license.license,
      config.ndlaFrontendDomain,
      (id: string) => t(locale, id),
      locale,
    );
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);
    const authors = getLicenseCredits(copyright);

    const contributors = getGroupedContributorDescriptionList(copyright, locale).map((item) => ({
      name: item.description,
      type: item.label,
    }));

    const captionAuthors = getFirstNonEmptyLicenseCredits(authors);

    return (
      <>
        <FigureCaption
          figureId={figureid}
          id={`${id}`}
          reuseLabel={t(locale, 'image.reuse')}
          licenseRights={license.rights}
          authors={captionAuthors}
          locale={locale}>
          <FigureLicenseDialog
            id={`${id}`}
            title={title}
            license={license}
            authors={contributors}
            origin={origin}
            locale={locale}
            messages={messages(locale)}>
            <ImageActionButtons
              locale={locale}
              copyString={copyString}
              src={imageUrl}
              license={licenseAbbreviation}
            />
          </FigureLicenseDialog>
        </FigureCaption>
      </>
    );
  };

  const embedToHTML = async ({ audio, data, imageMeta }: AudioEmbed, locale: LocaleType) => {
    const {
      id,
      title: { title },
      audioFile: { url },
      manuscript,
      podcastMeta,
      series,
      copyright: {
        license: { license: licenseAbbreviation },
        origin,
      },
    } = audio;

    const image = imageMeta;

    const { introduction, coverPhoto } = podcastMeta || {};
    const subtitle = series?.title;

    const textVersion = manuscript?.manuscript && renderMarkdown(manuscript.manuscript);
    const description = renderMarkdown(introduction ?? '');

    const img = coverPhoto && { url: coverPhoto.url, alt: coverPhoto.altText };

    const authors = getLicenseCredits(audio.copyright);

    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    const contributors = getGroupedContributorDescriptionList(audio.copyright, locale).map(
      (item) => ({
        name: item.description,
        type: item.label,
      }),
    );

    const figureLicenseDialogId = `audio-${id}`;
    const figureid = `figure-${id}`;
    const messages = {
      title: t(locale, 'title'),
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'license.audio.rules'),
      learnAboutLicenses: t(locale, 'license.learnMore'),
      source: t(locale, 'source'),
    };

    const copyString =
      audio.audioType === 'podcast'
        ? figureApa7CopyString(
            title,
            undefined,
            url,
            options.shortPath || options.path,
            audio.copyright,
            audio.copyright.license.license,
            config.ndlaFrontendDomain,
            (id: string) => t(locale, id),
            locale,
          )
        : undefined;
    const captionAuthors = getFirstNonEmptyLicenseCredits(authors);

    return {
      html: render(
        <Translation>
          {(_, { i18n }) => {
            i18n.changeLanguage(locale);
            return data.type === 'minimal' ? (
              <AudioPlayer speech src={url} title={title} />
            ) : (
              <Figure id={figureid} type="full">
                <AudioPlayer
                  description={description}
                  img={img}
                  src={url}
                  textVersion={textVersion}
                  title={title}
                  subtitle={subtitle}
                  staticRenderId={`static-render-${id}-${locale}`}
                />
                <FigureCaption
                  figureId={figureid}
                  id={figureLicenseDialogId}
                  reuseLabel={t(locale, 'audio.reuse')}
                  licenseRights={license.rights}
                  authors={captionAuthors}
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
                {image && <ImageLicense image={image} locale={locale} figureid={figureid} />}
              </Figure>
            );
          }}
        </Translation>,
        locale,
      ),
    };
  };

  return {
    resource: 'audio',
    onError,
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
