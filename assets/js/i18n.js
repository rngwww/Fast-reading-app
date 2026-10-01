// Internationalization (i18n) Module for TACHYON
// Supports English, Chinese (Simplified), Spanish, German, and French

export const SUPPORTED_LANGUAGES = [
  { code: 'en', native: 'English', label: 'English' },
  { code: 'zh', native: '简体中文', label: 'Chinese (Simplified)' },
  { code: 'es', native: 'Español', label: 'Spanish' },
  { code: 'de', native: 'Deutsch', label: 'German' },
  { code: 'fr', native: 'Français', label: 'French' }
];

export const translations = {
  en: {
    nav: {
      reader: 'Reader',
      library: 'Library',
      prime: 'Prime',
      settings: 'Settings',
      guide: 'Guide'
    },
    header: {
      streakTitle: 'Daily Reading Streak & Goals',
      streakAria: 'Daily Reading Streak',
      dayUnit: 'DAY',
      daysUnit: 'DAYS'
    },
    reader: {
      stageTap: 'Tap to Play or Pause',
      quickSize: 'Cycle Word Size (Small, Medium, Large, XL)',
      paused: 'Paused',
      position: 'Position',
      speed: 'Speed',
      progress: 'Progress',
      rewind10: 'Rewind 10 words',
      skip10: 'Skip forward 10 words',
      resume: 'Resume reading',
      restart: 'Restart',
      restartAria: 'Restart from beginning',
      playOrPause: 'Play or Pause',
      decreaseSpeed: 'Decrease speed',
      increaseSpeed: 'Increase speed',
      toggleMute: 'Toggle mute',
      paste: 'Paste',
      pasteTooltip: 'Paste text from clipboard',
      clear: 'Clear',
      clearTooltip: 'Clear text',
      returnScratchpad: 'Return to Scratchpad',
      freeStarter: 'Free Starter',
      unlimitedPrime: 'Unlimited (Prime)',
      readyCountdown: 'Get Ready...',
      focusCountdown: 'Focus...',
      readCountdown: 'Read!',
      wpmReady: '{wpm} WPM Ready!',
      wordsEstimate: '{count} words',
      wordsEstimateMin: '{count} words (~{min} min read)',
      wordOfScrubber: 'Word {current} of {total}',
      placeholder: 'Paste or type any text to read at superhuman speeds...'
    },
    library: {
      title: 'Library',
      addBook: 'Add Book',
      emptyTitle: 'Your Library is Empty',
      emptySub: 'Tap "+ Add Book" above to create or import books (.epub / .txt).',
      readBtn: 'Read',
      delete: 'Delete',
      unknownAuthor: 'Unknown Author',
      wordsCount: '{count} words',
      progressPercent: '{pct}% completed'
    },
    prime: {
      badge: 'Prime',
      title: 'Unlimited Reading',
      subtitle: 'Unlock books of any length, offline library storage, and custom themes.',
      monthly: 'Monthly',
      annual: 'Annual',
      startTrial: 'Start Free Trial',
      activeMember: 'Prime Member Active'
    },
    settings: {
      typography: 'Typography',
      fontSans: 'Helvetica Neue',
      fontSansSub: 'Ultra Light',
      fontSerif: 'New York',
      fontSerifSub: 'Serif',
      fontMono: 'SF Mono',
      fontMonoSub: 'Mono',
      sizeSmall: 'Small',
      sizeMedium: 'Medium',
      sizeLarge: 'Large',
      sizeExtra: 'Extra',
      soundProfile: 'Sound Profile',
      soundHaptic: 'Haptic',
      soundHapticSub: 'Click',
      soundCeramic: 'Ceramic',
      soundCeramicSub: 'Tap',
      soundMechanical: 'Mechanical',
      soundMechanicalSub: 'Snap',
      soundWood: 'Wood',
      soundWoodSub: 'Block',
      soundPulse: 'Pulse',
      soundPulseSub: 'Pulse',
      soundVinyl: 'Vinyl',
      soundVinylSub: 'Analog',
      interfaceSounds: 'Interface Sounds',
      interfaceSoundsDesc: 'Audio feedback on tabs, buttons & gestures',
      enabled: 'Enabled',
      muted: 'Muted',
      appearance: 'Appearance',
      themeObsidian: 'Dark',
      themeDark: 'Dark',
      themeGraphite: 'Graphite',
      themeParchment: 'Parchment',
      themeLight: 'Light',
      focalColor: 'Focal Color',
      membership: 'Membership',
      togglePrime: 'Toggle Prime',
      appUpdate: 'App Update',
      appUpdateDesc: 'Clear cache and load latest version',
      forceUpdate: 'Update',
      language: 'Language'
    },
    languages: {
      en: 'English',
      zh: 'Chinese',
      es: 'Spanish',
      de: 'German',
      fr: 'French'
    },
    guide: {
      title: 'How It Works',
      step1Title: 'Focus on the Highlighted Letter',
      step1Desc: 'Every word aligns its focal letter with the reticle guide. Keeping your eyes steady eliminates scanning fatigue.',
      step2Title: 'Direct Visual Processing',
      step2Desc: 'At 350+ words per minute, inner verbal pronunciation fades and words are comprehended directly.',
      step3Title: 'Intuitive Controls',
      step3Desc: 'Tap the screen to play or pause. Double-tap to rewind or skip words. Slide the progress bar to navigate anywhere.'
    },
    modal: {
      bookDetails: {
        title: 'Book Details',
        authorDefault: 'Author',
        tabRead: 'Read & Progress',
        tabEdit: 'Edit Details',
        totalWords: 'Total Words',
        progress: 'Progress',
        estTime: 'Est. Time',
        startPosition: 'Start Position:',
        resetToStart: 'Reset to Start',
        needleHint: 'Tap any word in the text below to place your starting needle:',
        readBtn: 'Read',
        importDoc: 'Import Document',
        importSub: 'Tap or drop .epub or .txt file',
        extracting: 'Extracting text & chapters...',
        orEnterDetails: 'or enter details',
        titlePlaceholder: 'Title',
        authorPlaceholder: 'Author (optional)',
        contentPlaceholder: 'Paste or edit content here...',
        tagColor: 'Tag Color:',
        saveChanges: 'Save Changes',
        deleteBook: 'Delete Book'
      },
      completion: {
        title: 'Reading Finished',
        wordsRead: 'words read',
        timeSaved: 'time saved',
        done: 'Done'
      },
      about: {
        title: 'TACHYON',
        version: 'Version 2.5 • Liquid Glass',
        description: 'Rapid Serial Visual Presentation speed reader. Read faster than thought with optical anchoring, tactile haptic feedback, and borderless liquid glass.',
        engine: 'Engine',
        engineVal: 'RSVP Reticle 2.5',
        audio: 'Audio',
        audioVal: 'Console Synthesis Engine',
        storage: 'Storage',
        storageVal: 'Offline IndexedDB',
        done: 'Done'
      },
      streak: {
        title: 'DAY STREAK',
        daysUnit: 'DAY',
        daysPluralUnit: 'DAYS',
        motto: 'Your daily reading habit is active. Keep the flame glowing!',
        target: "Today's Target",
        bestStreak: 'BEST STREAK',
        sessions: 'SESSIONS',
        totalTime: 'TOTAL TIME',
        done: 'Done',
        weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      },
      comprehension: {
        badge: 'RSVP RETENTION',
        title: 'Comprehension Check',
        sub: 'How much did you absorb from this reading sprint?',
        wordsRead: 'WORDS READ',
        avgWpm: 'AVG WPM',
        ratingHazy: 'Hazy (< 50%)',
        ratingHazyDesc: 'Fast pace; missed key nuances',
        ratingGood: 'Good (~75%)',
        ratingGoodDesc: 'Comfortable grasp of the concepts',
        ratingMaster: 'Total Recall (100%)',
        ratingMasterDesc: 'Crystal clear comprehension',
        skip: 'Skip for now'
      }
    }
  },
  zh: {
    nav: {
      reader: '阅读',
      library: '书库',
      prime: '会员',
      settings: '设置',
      guide: '指南'
    },
    header: {
      streakTitle: '每日阅读连胜与目标',
      streakAria: '每日阅读连胜',
      dayUnit: '天',
      daysUnit: '天'
    },
    reader: {
      stageTap: '轻点播放或暂停',
      quickSize: '切换字号（小、中、大、特大）',
      paused: '已暂停',
      position: '位置',
      speed: '字速',
      progress: '进度',
      rewind10: '倒退 10 词',
      skip10: '快进 10 词',
      resume: '继续阅读',
      restart: '重新开始',
      restartAria: '从头开始',
      playOrPause: '播放或暂停',
      decreaseSpeed: '减速',
      increaseSpeed: '加速',
      toggleMute: '切换静音',
      paste: '粘贴',
      pasteTooltip: '从剪贴板粘贴文本',
      clear: '清空',
      clearTooltip: '清空文本',
      returnScratchpad: '返回便签本',
      freeStarter: '免费入门版',
      unlimitedPrime: '无限暢读 (Prime)',
      readyCountdown: '准备就绪...',
      focusCountdown: '集中注意力...',
      readCountdown: '开始阅读！',
      wpmReady: '{wpm} WPM 就绪！',
      wordsEstimate: '{count} 个词',
      wordsEstimateMin: '{count} 个词（约 {min} 分钟）',
      wordOfScrubber: '第 {current} 词 / 共 {total} 词',
      placeholder: '在此粘贴或输入任何文字，体验超越思维的飞速阅读...'
    },
    library: {
      title: '书库',
      addBook: '添加书籍',
      emptyTitle: '你的书库空空如也',
      emptySub: '点击上方“+ 添加书籍”创建或导入书籍文件（.epub / .txt）。',
      readBtn: '阅读',
      delete: '删除',
      unknownAuthor: '佚名作者',
      wordsCount: '{count} 词',
      progressPercent: '已完成 {pct}%'
    },
    prime: {
      badge: 'Prime',
      title: '无限极速阅读',
      subtitle: '解锁任意篇幅长书、离线本地书库存储与专属奢华主题。',
      monthly: '按月订阅',
      annual: '按年订阅',
      startTrial: '开启免费试用',
      activeMember: '尊贵会员进行中'
    },
    settings: {
      typography: '字体与排版',
      fontSans: 'Helvetica Neue',
      fontSansSub: '纤细无衬线',
      fontSerif: 'New York',
      fontSerifSub: '经典衬线',
      fontMono: 'SF Mono',
      fontMonoSub: '等宽字体',
      sizeSmall: '小',
      sizeMedium: '中',
      sizeLarge: '大',
      sizeExtra: '特大',
      soundProfile: '按键节拍音效',
      soundHaptic: '轻微震颤',
      soundHapticSub: '按压',
      soundCeramic: '精密陶瓷',
      soundCeramicSub: '轻叩',
      soundMechanical: '机械青轴',
      soundMechanicalSub: '清脆',
      soundWood: '天然木音',
      soundWoodSub: '温润',
      soundPulse: '冥想脉冲',
      soundPulseSub: '专注',
      soundVinyl: '黑胶唱片',
      soundVinylSub: '复古',
      interfaceSounds: '系统音效反馈',
      interfaceSoundsDesc: '轻点标签、按键与手势时的自然音效',
      enabled: '已开启',
      muted: '已静音',
      appearance: '外观主题',
      themeObsidian: '深色',
      themeDark: '深色',
      themeGraphite: '石墨灰',
      themeParchment: '羊皮纸',
      themeLight: '明亮白',
      focalColor: '视线焦点色',
      membership: '会员计划',
      togglePrime: '切换 Prime',
      appUpdate: '应用更新',
      appUpdateDesc: '清除缓存并加载最新版本',
      forceUpdate: '立即更新',
      language: '界面语言'
    },
    languages: {
      en: '英语',
      zh: '中文',
      es: '西班牙语',
      de: '德语',
      fr: '法语'
    },
    guide: {
      title: '工作原理',
      step1Title: '聚焦视线焦点字母',
      step1Desc: '每个词的核心识别点都会精准对齐准星标线。保持眼球固定，彻底告别来回扫视的疲劳。',
      step2Title: '直映式视觉认知',
      step2Desc: '当阅读速度突破 350 WPM 时，内心的默读声将渐渐消退，大脑直接将文字转化为概念。',
      step3Title: '直观轻盈的手势操控',
      step3Desc: '轻触屏幕即可播放或暂停；双击左右快速微调词句；拖动进度条自由掌控阅读节奏。'
    },
    modal: {
      bookDetails: {
        title: '书籍详情',
        authorDefault: '作者',
        tabRead: '阅读与进度',
        tabEdit: '编辑信息',
        totalWords: '总词数',
        progress: '阅读进度',
        estTime: '预估时间',
        startPosition: '起始位置：',
        resetToStart: '重置回开头',
        needleHint: '轻点下方文本中的任意词语，即可设定你的起始光标：',
        readBtn: '开始阅读',
        importDoc: '导入电子书文档',
        importSub: '点击或拖拽 .epub 或 .txt 文件',
        extracting: '正在解析章节与文本...',
        orEnterDetails: '或手动输入信息',
        titlePlaceholder: '书名',
        authorPlaceholder: '作者（可选）',
        contentPlaceholder: '在此粘贴或编辑文本内容...',
        tagColor: '标记色彩：',
        saveChanges: '保存更改',
        deleteBook: '删除书籍'
      },
      completion: {
        title: '阅读达成',
        wordsRead: '已读字词',
        timeSaved: '节省时间',
        done: '完成'
      },
      about: {
        title: 'TACHYON',
        version: '版本 2.5 • 流光玻璃',
        description: '基于 RSVP 视觉认知工程的极速阅读器。通过光学聚焦锚点、多重感官回馈与无界流动交互，让你领略超感阅读体验。',
        engine: '极速引擎',
        engineVal: 'RSVP Reticle 2.5',
        audio: '音频合成',
        audioVal: 'Console 物理拟真引擎',
        storage: '离线存储',
        storageVal: '本地 IndexedDB 数据库',
        done: '好的'
      },
      streak: {
        title: '天连续阅读',
        daysUnit: '天',
        daysPluralUnit: '天',
        motto: '你的每日阅读习惯正在稳步建立。让知识的火苗持久燃烧！',
        target: '今日阅读目标',
        bestStreak: '最佳连胜',
        sessions: '阅读次数',
        totalTime: '累计时长',
        done: '完成',
        weekDays: ['一', '二', '三', '四', '五', '六', '日']
      },
      comprehension: {
        badge: 'RSVP 认知留存',
        title: '理解度复盘',
        sub: '在刚才的速读冲刺中，你的大脑吸收了多少信息？',
        wordsRead: '已读词数',
        avgWpm: '平均字速',
        ratingHazy: '模糊 (< 50%)',
        ratingHazyDesc: '语速偏快，只抓住了少许片段',
        ratingGood: '良好 (~75%)',
        ratingGoodDesc: '理解轻松，核心观点与逻辑清晰',
        ratingMaster: '透彻领悟 (100%)',
        ratingMasterDesc: '条理分明，全盘吸收无阻碍',
        skip: '暂时跳过'
      }
    }
  },
  es: {
    nav: {
      reader: 'Lector',
      library: 'Biblioteca',
      prime: 'Prime',
      settings: 'Ajustes',
      guide: 'Guía'
    },
    header: {
      streakTitle: 'Racha y objetivos de lectura diaria',
      streakAria: 'Racha de lectura diaria',
      dayUnit: 'DÍA',
      daysUnit: 'DÍAS'
    },
    reader: {
      stageTap: 'Toca para reproducir o pausar',
      quickSize: 'Cambiar tamaño (Pequeño, Mediano, Grande, XL)',
      paused: 'Pausado',
      position: 'Posición',
      speed: 'Velocidad',
      progress: 'Progreso',
      rewind10: 'Retroceder 10 palabras',
      skip10: 'Avanzar 10 palabras',
      resume: 'Reanudar lectura',
      restart: 'Reiniciar',
      restartAria: 'Reiniciar desde el principio',
      playOrPause: 'Reproducir o pausar',
      decreaseSpeed: 'Disminuir velocidad',
      increaseSpeed: 'Aumentar velocidad',
      toggleMute: 'Alternar silencio',
      paste: 'Pegar',
      pasteTooltip: 'Pegar texto del portapapeles',
      clear: 'Borrar',
      clearTooltip: 'Borrar texto',
      returnScratchpad: 'Volver al bloc de notas',
      freeStarter: 'Inicial Gratuito',
      unlimitedPrime: 'Ilimitado (Prime)',
      readyCountdown: 'Prepárate...',
      focusCountdown: 'Enfócate...',
      readCountdown: '¡Lee!',
      wpmReady: '¡{wpm} PPM listo!',
      wordsEstimate: '{count} palabras',
      wordsEstimateMin: '{count} palabras (~{min} min lectura)',
      wordOfScrubber: 'Palabra {current} de {total}',
      placeholder: 'Pega o escribe cualquier texto para leer a velocidad sobrehumana...'
    },
    library: {
      title: 'Biblioteca',
      addBook: 'Añadir libro',
      emptyTitle: 'Tu biblioteca está vacía',
      emptySub: 'Toca "+ Añadir libro" para crear o importar libros (.epub / .txt).',
      readBtn: 'Leer',
      delete: 'Eliminar',
      unknownAuthor: 'Autor desconocido',
      wordsCount: '{count} palabras',
      progressPercent: '{pct}% completado'
    },
    prime: {
      badge: 'Prime',
      title: 'Lectura Ilimitada',
      subtitle: 'Desbloquea libros de cualquier tamaño, almacenamiento sin conexión y temas exclusivos.',
      monthly: 'Mensual',
      annual: 'Anual',
      startTrial: 'Iniciar prueba gratuita',
      activeMember: 'Miembro Prime Activo'
    },
    settings: {
      typography: 'Tipografía',
      fontSans: 'Helvetica Neue',
      fontSansSub: 'Ultra Ligera',
      fontSerif: 'New York',
      fontSerifSub: 'Serifa',
      fontMono: 'SF Mono',
      fontMonoSub: 'Monoespaciada',
      sizeSmall: 'Pequeño',
      sizeMedium: 'Mediano',
      sizeLarge: 'Grande',
      sizeExtra: 'Extra',
      soundProfile: 'Perfil de Sonido',
      soundHaptic: 'Háptico',
      soundHapticSub: 'Clic',
      soundCeramic: 'Cerámica',
      soundCeramicSub: 'Toque',
      soundMechanical: 'Mecánico',
      soundMechanicalSub: 'Chasquido',
      soundWood: 'Madera',
      soundWoodSub: 'Bloque',
      soundPulse: 'Pulso',
      soundPulseSub: 'Foco',
      soundVinyl: 'Vinilo',
      soundVinylSub: 'Analógico',
      interfaceSounds: 'Sonidos de Interfaz',
      interfaceSoundsDesc: 'Respuesta sonora en pestañas, botones y gestos',
      enabled: 'Activado',
      muted: 'Silenciado',
      appearance: 'Apariencia',
      themeObsidian: 'Oscuro',
      themeDark: 'Oscuro',
      themeGraphite: 'Grafito',
      themeParchment: 'Pergamino',
      themeLight: 'Claro',
      focalColor: 'Color Focal',
      membership: 'Membresía',
      togglePrime: 'Alternar Prime',
      appUpdate: 'Actualización',
      appUpdateDesc: 'Limpiar caché y cargar última versión',
      forceUpdate: 'Actualizar',
      language: 'Idioma'
    },
    languages: {
      en: 'Inglés',
      zh: 'Chino',
      es: 'Español',
      de: 'Alemán',
      fr: 'Francés'
    },
    guide: {
      title: 'Cómo Funciona',
      step1Title: 'Enfócate en la letra resaltada',
      step1Desc: 'Cada palabra alinea su punto de reconocimiento óptimo con la retícula. Mantener la mirada fija previene la fatiga ocular.',
      step2Title: 'Procesamiento visual directo',
      step2Desc: 'A más de 350 palabras por minuto, la subvocalización desaparece y los conceptos se absorben de inmediato.',
      step3Title: 'Controles táctiles intuitivos',
      step3Desc: 'Toca la pantalla para reproducir o pausar. Doble toque para avanzar o retroceder. Desliza la barra para saltar a cualquier punto.'
    },
    modal: {
      bookDetails: {
        title: 'Detalles del libro',
        authorDefault: 'Autor',
        tabRead: 'Lectura y progreso',
        tabEdit: 'Editar detalles',
        totalWords: 'Palabras totales',
        progress: 'Progreso',
        estTime: 'Tiempo est.',
        startPosition: 'Posición inicial:',
        resetToStart: 'Reiniciar al inicio',
        needleHint: 'Toca cualquier palabra abajo para colocar tu marcador de inicio:',
        readBtn: 'Leer',
        importDoc: 'Importar documento',
        importSub: 'Toca o suelta un archivo .epub o .txt',
        extracting: 'Extrayendo texto y capítulos...',
        orEnterDetails: 'o introduce los detalles',
        titlePlaceholder: 'Título',
        authorPlaceholder: 'Autor (opcional)',
        contentPlaceholder: 'Pega o edita el contenido aquí...',
        tagColor: 'Color de etiqueta:',
        saveChanges: 'Guardar cambios',
        deleteBook: 'Eliminar libro'
      },
      completion: {
        title: 'Lectura Finalizada',
        wordsRead: 'palabras leídas',
        timeSaved: 'tiempo ahorrado',
        done: 'Listo'
      },
      about: {
        title: 'TACHYON',
        version: 'Versión 2.5 • Cristal Líquido',
        description: 'Lector veloz RSVP. Lee a una velocidad sobrehumana con anclaje visual, respuesta háptica táctil y cristal líquido sin bordes.',
        engine: 'Motor',
        engineVal: 'Retícula RSVP 2.5',
        audio: 'Audio',
        audioVal: 'Motor de Síntesis de Consola',
        storage: 'Almacenamiento',
        storageVal: 'IndexedDB sin conexión',
        done: 'Entendido'
      },
      streak: {
        title: 'DÍAS DE RACHA',
        daysUnit: 'DÍA',
        daysPluralUnit: 'DÍAS',
        motto: 'Tu hábito de lectura diaria está activo. ¡Mantén viva la llama!',
        target: 'Meta de hoy',
        bestStreak: 'MEJOR RACHA',
        sessions: 'SESIONES',
        totalTime: 'TIEMPO TOTAL',
        done: 'Listo',
        weekDays: ['L', 'M', 'X', 'J', 'V', 'S', 'D']
      },
      comprehension: {
        badge: 'RETENCIÓN RSVP',
        title: 'Control de Comprensión',
        sub: '¿Cuánto absorbiste de esta sesión de lectura?',
        wordsRead: 'PALABRAS LEÍDAS',
        avgWpm: 'PPM MEDIO',
        ratingHazy: 'Borroso (< 50%)',
        ratingHazyDesc: 'Ritmo rápido; se escaparon detalles clave',
        ratingGood: 'Bueno (~75%)',
        ratingGoodDesc: 'Comprensión cómoda de las ideas clave',
        ratingMaster: 'Recuerdo Total (100%)',
        ratingMasterDesc: 'Claridad cristalina y retención plena',
        skip: 'Omitir por ahora'
      }
    }
  },
  de: {
    nav: {
      reader: 'Leser',
      library: 'Bibliothek',
      prime: 'Prime',
      settings: 'Einstellungen',
      guide: 'Anleitung'
    },
    header: {
      streakTitle: 'Tägliche Leseserie & Ziele',
      streakAria: 'Tägliche Leseserie',
      dayUnit: 'TAG',
      daysUnit: 'TAGE'
    },
    reader: {
      stageTap: 'Tippen zum Abspielen oder Anhalten',
      quickSize: 'Wortgröße umschalten (Klein, Mittel, Groß, XL)',
      paused: 'Pausiert',
      position: 'Position',
      speed: 'Tempo',
      progress: 'Fortschritt',
      rewind10: '10 Wörter zurückspulen',
      skip10: '10 Wörter vorspulen',
      resume: 'Lesen fortsetzen',
      restart: 'Neustarten',
      restartAria: 'Von vorne beginnen',
      playOrPause: 'Abspielen oder Anhalten',
      decreaseSpeed: 'Geschwindigkeit verringern',
      increaseSpeed: 'Geschwindigkeit erhöhen',
      toggleMute: 'Stummschaltung umschalten',
      paste: 'Einfügen',
      pasteTooltip: 'Text aus Zwischenablage einfügen',
      clear: 'Löschen',
      clearTooltip: 'Text löschen',
      returnScratchpad: 'Zurück zum Notizblock',
      freeStarter: 'Kostenloser Einstieg',
      unlimitedPrime: 'Unbegrenzt (Prime)',
      readyCountdown: 'Bereitmachen...',
      focusCountdown: 'Fokussieren...',
      readCountdown: 'Lesen!',
      wpmReady: '{wpm} WPM bereit!',
      wordsEstimate: '{count} Wörter',
      wordsEstimateMin: '{count} Wörter (~{min} Min. Lesezeit)',
      wordOfScrubber: 'Wort {current} von {total}',
      placeholder: 'Text hier einfügen oder tippen, um blitzschnell zu lesen...'
    },
    library: {
      title: 'Bibliothek',
      addBook: 'Buch hinzufügen',
      emptyTitle: 'Deine Bibliothek ist leer',
      emptySub: 'Tippe oben auf "+ Buch hinzufügen", um Bücher zu erstellen oder importieren (.epub / .txt).',
      readBtn: 'Lesen',
      delete: 'Löschen',
      unknownAuthor: 'Unbekannter Autor',
      wordsCount: '{count} Wörter',
      progressPercent: '{pct}% abgeschlossen'
    },
    prime: {
      badge: 'Prime',
      title: 'Grenzenloses Lesen',
      subtitle: 'Schalte Bücher jeder Länge, Offline-Speicherung und exklusive Themes frei.',
      monthly: 'Monatlich',
      annual: 'Jährlich',
      startTrial: 'Kostenlose Testversion starten',
      activeMember: 'Prime-Mitgliedschaft aktiv'
    },
    settings: {
      typography: 'Typografie',
      fontSans: 'Helvetica Neue',
      fontSansSub: 'Ultra Leicht',
      fontSerif: 'New York',
      fontSerifSub: 'Serife',
      fontMono: 'SF Mono',
      fontMonoSub: 'Nichtproportional',
      sizeSmall: 'Klein',
      sizeMedium: 'Mittel',
      sizeLarge: 'Groß',
      sizeExtra: 'Extra',
      soundProfile: 'Klangprofil',
      soundHaptic: 'Haptik',
      soundHapticSub: 'Klick',
      soundCeramic: 'Keramik',
      soundCeramicSub: 'Tippen',
      soundMechanical: 'Mechanisch',
      soundMechanicalSub: 'Schnapp',
      soundWood: 'Holz',
      soundWoodSub: 'Block',
      soundPulse: 'Puls',
      soundPulseSub: 'Fokus',
      soundVinyl: 'Vinyl',
      soundVinylSub: 'Analog',
      interfaceSounds: 'Interface-Klänge',
      interfaceSoundsDesc: 'Akustisches Feedback bei Tabs, Tasten & Gesten',
      enabled: 'Aktiviert',
      muted: 'Stumm',
      appearance: 'Erscheinungsbild',
      themeObsidian: 'Dunkel',
      themeDark: 'Dunkel',
      themeGraphite: 'Graphit',
      themeParchment: 'Pergament',
      themeLight: 'Hell',
      focalColor: 'Fokusfarbe',
      membership: 'Mitgliedschaft',
      togglePrime: 'Prime umschalten',
      appUpdate: 'App-Aktualisierung',
      appUpdateDesc: 'Cache leeren und neueste Version laden',
      forceUpdate: 'Aktualisieren',
      language: 'Sprache'
    },
    languages: {
      en: 'Englisch',
      zh: 'Chinesisch',
      es: 'Spanisch',
      de: 'Deutsch',
      fr: 'Französisch'
    },
    guide: {
      title: 'So funktioniert es',
      step1Title: 'Fokussiere den markierten Buchstaben',
      step1Desc: 'Jedes Wort richtet seinen optimalen Erkennungspunkt an der Ziellinie aus. Ruhige Augen verhindern visuelle Ermüdung.',
      step2Title: 'Direkte visuelle Verarbeitung',
      step2Desc: 'Ab 350 Wörtern pro Minute verstummt die innere Lesestimme und Konzepte werden unmittelbar erfasst.',
      step3Title: 'Intuitive Steuerung',
      step3Desc: 'Tippe auf den Bildschirm zum Starten/Pausieren. Doppeltippen zum Springen. Nutze die Leiste zum schnellen Scrollen.'
    },
    modal: {
      bookDetails: {
        title: 'Buchdetails',
        authorDefault: 'Autor',
        tabRead: 'Lesen & Fortschritt',
        tabEdit: 'Details bearbeiten',
        totalWords: 'Wörter gesamt',
        progress: 'Fortschritt',
        estTime: 'Geschätzte Zeit',
        startPosition: 'Startposition:',
        resetToStart: 'Auf Anfang zurücksetzen',
        needleHint: 'Tippe auf ein beliebiges Wort im Text, um deinen Lesestart zu setzen:',
        readBtn: 'Lesen',
        importDoc: 'Dokument importieren',
        importSub: '.epub- oder .txt-Datei hier ablegen oder antippen',
        extracting: 'Text und Kapitel werden extrahiert...',
        orEnterDetails: 'oder Details manuell eingeben',
        titlePlaceholder: 'Titel',
        authorPlaceholder: 'Autor (optional)',
        contentPlaceholder: 'Inhalt hier einfügen oder bearbeiten...',
        tagColor: 'Tag-Farbe:',
        saveChanges: 'Änderungen speichern',
        deleteBook: 'Buch löschen'
      },
      completion: {
        title: 'Lesen beendet',
        wordsRead: 'Wörter gelesen',
        timeSaved: 'Zeit gespart',
        done: 'Fertig'
      },
      about: {
        title: 'TACHYON',
        version: 'Version 2.5 • Liquid Glass',
        description: 'RSVP-Schnelllese-App. Schneller als Gedanken lesen mit optischer Verankerung, fühlbarem Feedback und randlosem Design.',
        engine: 'Engine',
        engineVal: 'RSVP-Fadenkreuz 2.5',
        audio: 'Audio',
        audioVal: 'Konsolen-Synthese-Engine',
        storage: 'Speicher',
        storageVal: 'Offline-IndexedDB',
        done: 'Schließen'
      },
      streak: {
        title: 'TAGE-SERIE',
        daysUnit: 'TAG',
        daysPluralUnit: 'TAGE',
        motto: 'Deine tägliche Lesegewohnheit ist aktiv. Halte die Flamme am Brennen!',
        target: 'Heutiges Ziel',
        bestStreak: 'BESTE SERIE',
        sessions: 'SITZUNGEN',
        totalTime: 'GESAMTZEIT',
        done: 'Fertig',
        weekDays: ['M', 'D', 'M', 'D', 'F', 'S', 'S']
      },
      comprehension: {
        badge: 'RSVP-BEHALTEN',
        title: 'Verständnisprüfung',
        sub: 'Wie viel hast du aus diesem Lesesprint behalten?',
        wordsRead: 'WÖRTER GELESEN',
        avgWpm: 'DURCHN. WPM',
        ratingHazy: 'Verschwommen (< 50%)',
        ratingHazyDesc: 'Hohes Tempo; Feinheiten verpasst',
        ratingGood: 'Gut (~75%)',
        ratingGoodDesc: 'Sicheres Verständnis der Kernpunkte',
        ratingMaster: 'Volles Verständnis (100%)',
        ratingMasterDesc: 'Glasklare und lückenlose Erfassung',
        skip: 'Vorerst überspringen'
      }
    }
  },
  fr: {
    nav: {
      reader: 'Lecteur',
      library: 'Bibliothèque',
      prime: 'Prime',
      settings: 'Paramètres',
      guide: 'Guide'
    },
    header: {
      streakTitle: 'Série de lecture quotidienne & Objectifs',
      streakAria: 'Série de lecture quotidienne',
      dayUnit: 'JOUR',
      daysUnit: 'JOURS'
    },
    reader: {
      stageTap: 'Toucher pour lire ou mettre en pause',
      quickSize: 'Changer la taille (Petit, Moyen, Grand, XL)',
      paused: 'En pause',
      position: 'Position',
      speed: 'Vitesse',
      progress: 'Progression',
      rewind10: 'Reculer de 10 mots',
      skip10: 'Avancer de 10 mots',
      resume: 'Reprendre la lecture',
      restart: 'Redémarrer',
      restartAria: 'Recommencer depuis le début',
      playOrPause: 'Lire ou mettre en pause',
      decreaseSpeed: 'Diminuer la vitesse',
      increaseSpeed: 'Augmenter la vitesse',
      toggleMute: 'Activer/désactiver le son',
      paste: 'Coller',
      pasteTooltip: 'Coller le texte du presse-papiers',
      clear: 'Effacer',
      clearTooltip: 'Effacer le texte',
      returnScratchpad: 'Retourner au bloc-notes',
      freeStarter: 'Démarrage Gratuit',
      unlimitedPrime: 'Illimité (Prime)',
      readyCountdown: 'Préparez-vous...',
      focusCountdown: 'Concentrez-vous...',
      readCountdown: 'Lisez !',
      wpmReady: '{wpm} MPM prêt !',
      wordsEstimate: '{count} mots',
      wordsEstimateMin: '{count} mots (~{min} min de lecture)',
      wordOfScrubber: 'Mot {current} sur {total}',
      placeholder: 'Collez ou écrivez du texte ici pour lire à une vitesse foudroyante...'
    },
    library: {
      title: 'Bibliothèque',
      addBook: 'Ajouter un livre',
      emptyTitle: 'Votre bibliothèque est vide',
      emptySub: 'Touchez "+ Ajouter un livre" pour créer ou importer des livres (.epub / .txt).',
      readBtn: 'Lire',
      delete: 'Supprimer',
      unknownAuthor: 'Auteur inconnu',
      wordsCount: '{count} mots',
      progressPercent: '{pct}% terminé'
    },
    prime: {
      badge: 'Prime',
      title: 'Lecture Illimitée',
      subtitle: 'Débloquez des livres de toute taille, le stockage hors ligne et des thèmes exclusifs.',
      monthly: 'Mensuel',
      annual: 'Annuel',
      startTrial: "Démarrer l'essai gratuit",
      activeMember: 'Membre Prime Actif'
    },
    settings: {
      typography: 'Typographie',
      fontSans: 'Helvetica Neue',
      fontSansSub: 'Ultra Léger',
      fontSerif: 'New York',
      fontSerifSub: 'Avec empattement',
      fontMono: 'SF Mono',
      fontMonoSub: 'Monospace',
      sizeSmall: 'Petit',
      sizeMedium: 'Moyen',
      sizeLarge: 'Grand',
      sizeExtra: 'Très grand',
      soundProfile: 'Profil Sonore',
      soundHaptic: 'Haptique',
      soundHapticSub: 'Clic',
      soundCeramic: 'Céramique',
      soundCeramicSub: 'Frappe',
      soundMechanical: 'Mécanique',
      soundMechanicalSub: 'Déclic',
      soundWood: 'Bois',
      soundWoodSub: 'Bloc',
      soundPulse: 'Pulsion',
      soundPulseSub: 'Focus',
      soundVinyl: 'Vinyle',
      soundVinylSub: 'Analogique',
      interfaceSounds: "Sons de l'interface",
      interfaceSoundsDesc: 'Retour sonore sur les onglets, boutons et gestes',
      enabled: 'Activé',
      muted: 'Muet',
      appearance: 'Apparence',
      themeObsidian: 'Sombre',
      themeDark: 'Sombre',
      themeGraphite: 'Graphite',
      themeParchment: 'Parchemin',
      themeLight: 'Clair',
      focalColor: 'Couleur Focale',
      membership: 'Abonnement',
      togglePrime: 'Basculer Prime',
      appUpdate: 'Mise à jour',
      appUpdateDesc: "Vider le cache et recharger la dernière version de l'application",
      forceUpdate: 'Mettre à jour',
      language: 'Langue'
    },
    languages: {
      en: 'Anglais',
      zh: 'Chinois',
      es: 'Espagnol',
      de: 'Allemand',
      fr: 'Français'
    },
    guide: {
      title: 'Comment ça fonctionne',
      step1Title: 'Fixez la lettre mise en évidence',
      step1Desc: "Chaque mot aligne son point focal sur le réticule. Garder le regard immobile élimine la fatigue visuelle.",
      step2Title: 'Traitement visuel direct',
      step2Desc: 'À plus de 350 mots par minute, la petite voix intérieure se tait et les idées sont comprises directement.',
      step3Title: 'Commandes tactiles intuitives',
      step3Desc: "Touchez l'écran pour lire ou mettre en pause. Touchez deux fois pour reculer ou avancer. Glissez pour naviguer où vous voulez."
    },
    modal: {
      bookDetails: {
        title: 'Détails du livre',
        authorDefault: 'Auteur',
        tabRead: 'Lecture & Progression',
        tabEdit: 'Modifier les détails',
        totalWords: 'Mots au total',
        progress: 'Progression',
        estTime: 'Temps estimé',
        startPosition: 'Position de départ :',
        resetToStart: 'Remettre au début',
        needleHint: "Touchez un mot dans le texte ci-dessous pour définir votre point de départ :",
        readBtn: 'Lire',
        importDoc: 'Importer un document',
        importSub: 'Touchez ou déposez un fichier .epub ou .txt',
        extracting: 'Extraction du texte et des chapitres...',
        orEnterDetails: 'ou saisissez les détails',
        titlePlaceholder: 'Titre',
        authorPlaceholder: 'Auteur (optionnel)',
        contentPlaceholder: 'Collez ou modifiez le contenu ici...',
        tagColor: 'Couleur de balise :',
        saveChanges: 'Enregistrer',
        deleteBook: 'Supprimer le livre'
      },
      completion: {
        title: 'Lecture terminée',
        wordsRead: 'mots lus',
        timeSaved: 'temps économisé',
        done: 'Terminé'
      },
      about: {
        title: 'TACHYON',
        version: 'Version 2.5 • Verre Liquide',
        description: "Lecteur rapide RSVP. Lisez plus vite que la pensée grâce à l'ancrage optique, au retour haptique et au design en verre liquide.",
        engine: 'Moteur',
        engineVal: 'Réticule RSVP 2.5',
        audio: 'Audio',
        audioVal: 'Moteur de Synthèse de Console',
        storage: 'Stockage',
        storageVal: 'IndexedDB hors ligne',
        done: 'Fermer'
      },
      streak: {
        title: 'JOURS DE SÉRIE',
        daysUnit: 'JOUR',
        daysPluralUnit: 'JOURS',
        motto: 'Votre habitude quotidienne de lecture est active. Gardez la flamme vivante !',
        target: "Objectif d'aujourd'hui",
        bestStreak: 'MEILLEURE SÉRIE',
        sessions: 'SESSIONS',
        totalTime: 'TEMPS TOTAL',
        done: 'Terminé',
        weekDays: ['L', 'M', 'M', 'J', 'V', 'S', 'D']
      },
      comprehension: {
        badge: 'RÉTENTION RSVP',
        title: 'Vérification de compréhension',
        sub: 'Combien avez-vous retenu de cette session de lecture ?',
        wordsRead: 'MOTS LUS',
        avgWpm: 'MPM MOYEN',
        ratingHazy: 'Flou (< 50%)',
        ratingHazyDesc: 'Rythme rapide ; nuances manquées',
        ratingGood: 'Bon (~75%)',
        ratingGoodDesc: 'Compréhension aisée des concepts clés',
        ratingMaster: 'Compréhension Totale (100%)',
        ratingMasterDesc: 'Parfaite clarté et assimilation totale',
        skip: "Passer pour l'instant"
      }
    }
  }
};

export const localizedQuotes = {
  en: [
    "The more that you read, the more things you will know. — Dr. Seuss",
    "Reading is to the mind what exercise is to the body. — Joseph Addison",
    "Your eyes were meant to absorb concepts, not count syllables.",
    "A reader lives a thousand lives before he dies. The fast reader lives ten thousand.",
    "Speed is the byproduct of effortless focus.",
    "Think in paragraphs, absorb in concepts, unlock in seconds."
  ],
  zh: [
    "读书破万卷，下笔如有神。 — 杜甫",
    "读一本好书，就是和许多高尚的人谈话。 — 歌德",
    "书籍是人类进步的阶梯。 — 高尔基",
    "眼睛是为了捕捉思想，而不是逐字数音节。",
    "专注不是紧绷，而是让思维全速流动。",
    "以段落思考，以概念领悟，于瞬间洞见真知。"
  ],
  es: [
    "El que lee mucho y anda mucho, ve mucho y sabe mucho. — Miguel de Cervantes",
    "La lectura es a la mente lo que el ejercicio al cuerpo. — Joseph Addison",
    "Tus ojos fueron hechos para absorber conceptos, no para contar sílabas.",
    "Un lector vive mil vidas antes de morir. El lector rápido vive diez mil.",
    "La velocidad es el fruto de una concentración sin esfuerzo.",
    "Piensa en párrafos, absorbe en conceptos, comprende en segundos."
  ],
  de: [
    "Lesen heißt durch fremde Hand träumen. — Fernando Pessoa",
    "Lesen ist für den Geist, was Gymnastik für den Körper ist. — Joseph Addison",
    "Deine Augen sollen Konzepte aufnehmen, nicht Silben zählen.",
    "Ein Leser lebt tausend Leben, bevor er stirbt. Der Schnellleser zehntausend.",
    "Geschwindigkeit ist das Resultat müheloser Konzentration.",
    "Denke in Absätzen, nimm Konzepte auf, verstehe in Sekunden."
  ],
  fr: [
    "La lecture est une porte ouverte sur un monde enchanté. — François Mauriac",
    "La lecture est à l'esprit ce que l'exercice est au corps. — Joseph Addison",
    "Vos yeux ont été créés pour absorber des idées, pas pour compter des syllabes.",
    "Un lecteur vit mille vies avant de mourir. Le lecteur rapide en vit dix mille.",
    "La vitesse est le fruit d'une concentration fluide et naturelle.",
    "Pensez en paragraphes, absorbez en concepts, comprenez en quelques secondes."
  ]
};

let currentLang = 'en';
const listeners = new Set();

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);
}

export function t(key, params = {}) {
  const dict = translations[currentLang] || translations.en;
  let val = getNestedValue(dict, key) ?? getNestedValue(translations.en, key) ?? key;
  
  if (typeof val === 'string') {
    for (const [k, v] of Object.entries(params)) {
      val = val.replaceAll(`{${k}}`, v);
    }
  }
  return val;
}

export function getCurrentLanguage() {
  return currentLang;
}

export function getRandomQuote(lang = currentLang) {
  const quotes = localizedQuotes[lang] || localizedQuotes.en;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function onLanguageChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyLanguage(lang) {
  if (!translations[lang]) {
    lang = 'en';
  }
  currentLang = lang;

  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = t(key);
      }
    });

    // Title attribute (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = t(key);
      }
    });

    // Aria label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', t(key));
      }
    });
  }

  // Notify registered callbacks
  listeners.forEach(fn => {
    try {
      fn(currentLang);
    } catch (e) {
      console.error('Error in i18n change listener:', e);
    }
  });
}
