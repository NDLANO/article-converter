/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedType, PluginUnion, Plugin } from '../interfaces';

export const findPlugin = <T extends EmbedType>(
  plugins: PluginUnion[],
  embed: T,
): Plugin<T> | undefined => {
  const plugin = plugins.find((p) => {
    return p.resource === embed.embed.data().resource;
  });

  return plugin as Plugin<T>;
};
