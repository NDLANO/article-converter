/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AnyPlugin, Plugin, AnyEmbed, EmbedData } from '../interfaces';

export const findPlugin = <T extends AnyEmbed>(
  plugins: AnyPlugin[],
  embed: T,
): Plugin<T, EmbedData> | undefined => {
  const plugin = plugins.find((p) => {
    return p.resource === (embed.data.resource ?? embed.embed.data().resource);
  });

  return plugin as Plugin<T, EmbedData>;
};
