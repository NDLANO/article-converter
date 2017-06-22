import { getAuthors } from '../brightcove';

test('brightcove/getAuthors parses author string correctly', () => {
  const fields = {
    licenseinfo: 'Opphavsmann: Senter for nye medier, Høgskolen i Bergen',
    licenseinfo1: 'Opphavsmann:Adalia film & media',
    licenseinfo2: 'Opphavsmann:    Norsk Helseinformatikk',
    yt_privacy_status: 'private',
    license: 'Navngivelse-Del på samme vilkår',
  };

  const authors = getAuthors(fields);
  expect(authors).toEqual([
    {
      type: 'Opphavsmann',
      name: 'Senter for nye medier, Høgskolen i Bergen',
    },
    {
      type: 'Opphavsmann',
      name: 'Adalia film & media',
    },
    {
      type: 'Opphavsmann',
      name: 'Norsk Helseinformatikk',
    },
  ]);
});

test('brightcove/getAuthors uses fallback if author string could not be parsed', () => {
  const fields = {
    licenseinfo: 'Opphavsmann: Senter for nye medier, Høgskolen i Bergen',
    licenseinfo1: 'Opphavsmann Adalia film & media',
    yt_privacy_status: 'private',
    license: 'Navngivelse-Del på samme vilkår',
  };

  const authors = getAuthors(fields);
  expect(authors).toEqual([
    {
      type: 'Opphavsmann',
      name: 'Senter for nye medier, Høgskolen i Bergen',
    },
    {
      type: '',
      name: 'Opphavsmann Adalia film & media',
    },
  ]);
});
