import { defineStore } from 'pinia';

export const usePromoStore = defineStore('promoStore', () => {
  const sideBarOpen = ref<Boolean>(false);
  const promosList = ref<any[]>([
    {
      source: {
        id: 'the-verge',
        name: 'The Verge',
      },
      author: 'Justine Calma',
      title: 'Can banks push Bitcoin to clean up its act?',
      description:
        'Banks and asset managers have a big stake in Bitcoin, so Greenpeace wants them to crack down on the cryptocurrency’s pollution.',
      url: 'https://www.theverge.com/2023/7/11/23778688/bitcoin-energy-emissions-climate-change-banks-asset-managers-greenpeace',
      urlToImage:
        'https://cdn.vox-cdn.com/thumbor/ODx_QBV2qCE_dfhHtwtaZ8W6J8I=/0x0:7144x4743/1200x628/filters:focal(3572x2372:3573x2373)/cdn.vox-cdn.com/uploads/chorus_asset/file/24763884/1235926940.jpg',
      publishedAt: '2023-07-11T14:00:00Z',
      content:
        'Can banks push Bitcoin to clean up its act?\r\nCan banks push Bitcoin to clean up its act?\r\n / Banks and asset managers have a big stake in Bitcoin, so Greenpeace wants them to crack down on the crypto… [+4372 chars]',
    },
    {
      source: {
        id: null,
        name: 'Gizmodo.com',
      },
      author: 'Kevin Hurler',
      title:
        'SEC Reportedly Asked Coinbase to Halt All Trading—Except for Bitcoin',
      description:
        'Coinbase’s CEO Brian Armstrong reportedly told the Financial Times that the U.S. Securities & Exchange Commission asked him to halt trading in the exchange with all currencies except bitcoin. According to Armstrong, the suggestion came just before the SEC sue…',
      url: 'https://gizmodo.com/sec-asked-coinbase-to-halt-trading-except-for-bitcoin-1850691411',
      urlToImage:
        'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/76f95899df261776c441932b344183f1.jpg',
      publishedAt: '2023-07-31T14:55:00Z',
      content:
        'Coinbases CEO Brian Armstrong reportedly told the Financial Times that the U.S. Securities &amp; Exchange Commission asked him to halt trading in the exchange with all currencies except bitcoin. Acco… [+1850 chars]',
    },
    {
      source: {
        id: null,
        name: 'Gizmodo.com',
      },
      author: 'Cheryl Eddy',
      title:
        "Everyone's Favorite Knife-Wielding Robot Returns in Next Week's Futurama",
      description:
        'Futurama’s new season continues its examination of 3023 by way of 2023 with next week’s “How the West Was 1010001,” which sees the gang heading to, ahem, Doge City to cash in on the bitcoin mining craze. Like most places they visit, they encounter absurdities…',
      url: 'https://gizmodo.com/futurama-hulu-new-ep-3-clips-bitcoin-crypto-wild-west-1850708869',
      urlToImage:
        'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/11cf0e30bb3cfd27a7b0f55aa6eddfd3.jpg',
      publishedAt: '2023-08-04T20:45:00Z',
      content:
        'Futuramas new season continues its examination of 3023 by way of 2023 with next weeks How the West Was 1010001, which sees the gang heading to, ahem, Doge City to cash in on the bitcoin mining craze.… [+2351 chars]',
    },
    {
      source: {
        id: 'the-verge',
        name: 'The Verge',
      },
      author: 'Emma Roth',
      title: 'PayPal launches PYUSD stablecoin backed by the US dollar',
      description:
        'PayPal has launched a stablecoin called PayPal USD, starting today and “rolling out in the coming weeks.” The new stablecoin can be used for purchases and person-to-person payments.',
      url: 'https://www.theverge.com/2023/8/7/23822752/paypal-pyusd-stablecoin-cryptocurrency',
      urlToImage:
        'https://cdn.vox-cdn.com/thumbor/AzUxs8UmwIY2lOByn5LIX8geWjY=/0x0:2200x1650/1200x628/filters:focal(1100x825:1101x826)/cdn.vox-cdn.com/uploads/chorus_asset/file/24835037/PayPal_stablecoin.png',
      publishedAt: '2023-08-07T14:07:51Z',
      content:
        'PayPal launches PYUSD stablecoin backed by the US dollar\r\nPayPal launches PYUSD stablecoin backed by the US dollar\r\n / PayPal USD is built on Ethereum and is 1:1 redeemable for US dollars.\r\nPayPal is… [+1960 chars]',
    },
    {
      source: {
        id: 'business-insider',
        name: 'Business Insider',
      },
      author: 'Matthew Fox',
      title:
        'Bitcoin could soar to $180,000 before the April 2024 halving as potential BlackRock ETF helps drive demand, Fundstrat says',
      description:
        '"We anticipate [a bitcoin ETF] would attract new investors and generate increased demand for bitcoin," Fundstrat said.',
      url: 'https://markets.businessinsider.com/news/currencies/bitcoin-price-outlook-blackrock-etf-filing-demand-180000-crypto-halving-2023-7',
      urlToImage:
        'https://i.insider.com/64bebc9fbea3440019602937?width=1200&format=jpeg',
      publishedAt: '2023-07-24T18:47:22Z',
      content:
        'Wenjin Chen/Getty Images\r\n<ul><li>The price of bitcoin could soar to $180,000 before the scheduled April 2024 halving, according to Fundstrat.</li><li>Fundstrat said a bitcoin ETF from BlackRock coul… [+2884 chars]',
    },
  ]); // Armazena os dados dos voos que recebeu da API.

  async function searchPromos() {
    // ESPERAR A API OFICIAL DE PROMOS
    const { data, error } = await useFetch(
      'https://newsapi.org/v2/everything?q=bitcoin&pageSize=10&apiKey=07dc17d548814edeb094ed93fa352deb',
      {
        method: 'GET', // Especifique o método POST para enviar dados no corpo da requisição
        headers: {
          'Content-Type': 'application/json', // Defina o tipo de conteúdo como JSON
        },
      }
    );
    if (error.value) {
      throw createError({
        statusCode: 404,
        statusMessage: 'API fora do ar. Entre em contato com o GRUPO BRT!',
      });
    }
    console.log(data);
    promosList.value = [...promosList.value, data];
  }

  return {
    promosList,
    sideBarOpen,
    searchPromos,
  };
});
