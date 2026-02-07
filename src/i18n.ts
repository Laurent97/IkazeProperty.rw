import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  const localeToUse = locale || 'en';
  return {
    locale: localeToUse as string,
    messages: (await import(`./messages/${localeToUse}.json`)).default
  };
});
