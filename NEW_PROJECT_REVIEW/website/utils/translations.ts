// Utility for managing translations across supported languages.
// Each string used in the UI should be defined here for both
// English (en) and Arabic (ar). Do not insert marketing language;
// keep phrases calm, premium and concise.

export type Language = 'en' | 'ar';

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

interface Translations {
  en: TranslationMap;
  ar: TranslationMap;
}

// Translation dictionary. If you add a new key ensure it's defined
// for both languages.
export const translations: Translations = {
  en: {
    nav: {
      menu: 'Menu',
      founder: 'Founder',
      story: 'Our Story',
      branches: 'Branches',
      contactUs: 'Contact Us',
      cart: 'Cart',
      language: 'Language',
      install: 'Install App'
    },
    hero: {
      title: 'Baghdad Generosity.. with Bahrain Hospitality',
      subtitle: 'Where stories dwell and authenticity is slow‑cooked'
    },
    menu: {
      title: 'Menu',
      empty: 'Our curated menu will be available soon.',
      addToCart: 'Add to cart',
      added: 'Item added to cart'
    },
    founder: {
      title: 'The story behind Kahramana Baghdad',
      subtitle: 'When vision turns into a taste experience',
      name: 'Engineer Asaad Al‑Jabbouri',
      role: 'Owner & Founder',
      description: 'Engineer Asaad Al‑Jabbouri carries a deep passion for details; it is the same passion that accompanied him from the world of engineering to the world of flavour. Food for him was not merely a commercial project but a sincere way to convey the culture and generosity of Baghdad to Bahrain. With an engineer’s mindset that believes quality is built and not coincidental, he designed “Kahramana Baghdad” to be more than a restaurant; a space where Iraqi authenticity meets contemporary taste and refined Bahraini hospitality. Today he stands behind every detail offered to the guest — from the choice of ingredients to the way of presentation — to ensure each visit reflects his passion, vision and respect for his guests’ taste.',
      quote: 'I didn’t just build a restaurant… I brought the flavour of Baghdad to Bahrain.'
    },
    story: {
      title: 'Kahramana Baghdad: A tale of generosity told at the table',
      subtitle: 'Where Baghdad heritage meets the warmth of Bahraini hospitality',
      description: '“Kahramana” in the Baghdadi memory was not merely a story to be told but a symbol of cleverness, generosity and victory through wisdom. From this deep meaning the idea of “Kahramana Baghdad” was born — a restaurant that evokes the spirit of authentic Baghdad and presents it in a contemporary style worthy of today’s taste. At “Kahramana Baghdad” we do not offer food as inherited recipes only, but craft a complete experience. We take the secrets of authentic Baghdadi flavour and carefully blend them with the elegance of Bahraini hospitality to create a taste that merges the authenticity of the past with the refinement of the present. Each dish offered is an invitation to a sensory journey that begins from the alleys of old Baghdad and travels through time to your table in Bahrain. Here, meals are not just served, but a story of generosity, passion and uniqueness is offered to make our guests feel at home.',
      quote: 'Here we do not just serve food… we revive a legacy and create an experience.'
    },
    branches: {
      title: 'Branches',
      riffa: {
        title: 'Riffa (Hajiyat)',
        description: 'Hajiyat Riffa, Bahrain'
      },
      galali: {
        title: 'Galali (Muharraq)',
        description: 'Muharraq, Bahrain'
      }
    },
    contact: {
      title: 'Contact Us',
      callUs: 'Call us',
      riffaPhone: '17131413',
      riffaWhatsApp: '97317131413',
      galaliPhone: '17131213',
      galaliWhatsApp: '97317131213',
      email: 'info@kahramana.com',
      instagram: '@kahramanat_b',
      snapchat: '@kahramanat_b',
      tiktok: '@kahramanat_b'
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty.',
      checkout: 'Checkout',
      total: 'Total',
      close: 'Close',
      remove: 'Remove'
    },
    languageSwitcher: {
      en: 'English',
      ar: 'Arabic',
      change: 'Change Language'
    }
  },
  ar: {
    nav: {
      menu: 'القائمة',
      founder: 'المؤسس',
      story: 'قصتنا',
      branches: 'الفروع',
      contactUs: 'اتصل بنا',
      cart: 'السلة',
      language: 'اللغة',
      install: 'تثبيت التطبيق'
    },
    hero: {
      title: 'كرم بغداد.. بضيافة البحرين',
      subtitle: 'حيث تسكن الحكايات وتُطبخ الأصالة على نار هادئة'
    },
    menu: {
      title: 'القائمة',
      empty: 'قائمتنا المختارة ستكون متاحة قريباً.',
      addToCart: 'أضف إلى السلة',
      added: 'تمت إضافة العنصر إلى السلة'
    },
    founder: {
      title: 'القصة وراء كهرمانة بغداد',
      subtitle: 'حين تتحول الرؤية إلى تجربة تُذاق',
      name: 'المهندس أسعد الجبوري',
      role: 'المالك والمؤسس',
      description: 'يحمل المهندس أسعد الجبوري شغفًا عميقًا بالتفاصيل، وهو الشغف ذاته الذي رافقه من عالم الهندسة إلى عالم المذاق. لم يكن الطعام بالنسبة له مشروعًا تجاريًا، بل وسيلة صادقة لنقل ثقافة وكرم بغداد إلى البحرين. بعقلية مهندس يؤمن بأن الجودة تُبنى ولا تُصادف، صمّم «كهرمانة بغداد» ليكون أكثر من مطعم؛ مساحة تلتقي فيها الأصالة العراقية مع الذوق العصري والضيافة البحرينية الراقية. اليوم، يقف الجبوري خلف كل تفصيلة تُقدَّم للضيف — من اختيار المكونات إلى طريقة التقديم — ليضمن أن تكون كل تجربة زيارة انعكاسًا حقيقيًا لشغفه، ورؤيته، واحترامه لذائقة ضيوفه.',
      quote: 'لم أبنِ مطعمًا فقط… بل نقلت نكهة بغداد إلى البحرين.'
    },
    story: {
      title: 'كهرمانة بغداد: حكاية كرم تُروى على المائدة',
      subtitle: 'حين يلتقي إرث بغداد بدفء الضيافة البحرينية',
      description: 'لم تكن «كهرمانة» في الذاكرة البغدادية مجرد حكاية تُروى، بل كانت رمزًا للفطنة والكرم والانتصار بالحكمة. من هذا المعنى العميق وُلدت فكرة «كهرمانة بغداد» — مطعم يستحضر روح بغداد الأصيلة ويقدّمها بأسلوب معاصر يليق بذائقة اليوم. في «كهرمانة بغداد»، لا نقدّم الطعام بوصفه وصفات موروثة فحسب، بل نصنع تجربة متكاملة. نأخذ أسرار المذاق البغدادي الأصيل ونمزجها بعناية مع أناقة الضيافة البحرينية، لنخلق نكهة تجمع أصالة الماضي ورُقي الحاضر. كل طبق يُقدَّم هو دعوة لرحلة حسّية تبدأ من أزقة بغداد القديمة، وتعبر الزمن لتصل إلى مائدتك في البحرين. هنا، لا تُقدَّم الوجبات فقط، بل تُقدَّم حكاية كرم، وشغف، وتفرّد تُشعر ضيوفنا بأنهم في بيتهم.',
      quote: '"هنا لا نُقدّم طعامًا فقط… بل نُحيي إرثًا ونصنع تجربة."'
    },
    branches: {
      title: 'الفروع',
      riffa: {
        title: 'الرفاع (الحجيات)',
        description: 'الحجيات، الرفاع، البحرين'
      },
      galali: {
        title: 'قلالي (المحرق)',
        description: 'المحرق، البحرين'
      }
    },
    contact: {
      title: 'اتصل بنا',
      callUs: 'اتصل بنا',
      riffaPhone: '17131413',
      riffaWhatsApp: '97317131413',
      galaliPhone: '17131213',
      galaliWhatsApp: '97317131213',
      email: 'info@kahramana.com',
      instagram: '@kahramanat_b',
      snapchat: '@kahramanat_b',
      tiktok: '@kahramanat_b'
    },
    cart: {
      title: 'سلتك',
      empty: 'سلتك فارغة.',
      checkout: 'إتمام الطلب',
      total: 'الإجمالي',
      close: 'إغلاق',
      remove: 'حذف'
    },
    languageSwitcher: {
      en: 'الإنجليزية',
      ar: 'العربية',
      change: 'تغيير اللغة'
    }
  }
};

/**
 * Retrieve a translation for the given key path based on the active language.
 * Example: t(translations, language, ['nav','menu']) returns the value for
 * translations[language].nav.menu.
 */
export function getTranslation(
  language: Language,
  path: string[]
): string {
  let current: any = translations[language];
  for (const segment of path) {
    if (current[segment] !== undefined) {
      current = current[segment];
    } else {
      return '';
    }
  }
  return typeof current === 'string' ? current : '';
}