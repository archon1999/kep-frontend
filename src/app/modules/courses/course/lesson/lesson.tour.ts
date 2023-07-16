let backBtnClass = 'btn btn-sm btn-outline-primary';
let nextBtnClass = 'btn btn-sm btn-primary btn-next';

export let lessonTourSteps = [
  {
    title: 'Kurs haqida ma`lumot',
    text: 'Kursni qancha foizi tugatilganligi va qancha ball to`planilganligi haqida ma`lumot. Ballar faqat topshiriqlar bajarish orqali to`planadi.',
    attachTo: {
      element: '.tour-step-1',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Tugatish',
        type: 'cancel',
        classes: backBtnClass
      },
      {
        text: 'Keyingisi',
        type: 'next',
        classes: nextBtnClass
      }
    ],
    useModalOverlay: true
  },
  {
    title: 'O`quv rejasi',
    text: 'Darslar va ularning qancha qismi tugatilganligi haqida ma`lumot.',
    attachTo: {
      element: '.tour-step-2',
      on: 'top'
    },
    buttons: [
      {
        text: 'Tugatish',
        type: 'cancel',
        classes: backBtnClass
      },

      {
        text: 'Orqaga',
        type: 'back',
        classes: backBtnClass
      },
      {
        text: 'Keyingisi',
        type: 'next',
        classes: nextBtnClass
      }
    ]
  },
  {
    title: 'Lug`at',
    text: 'Lug`at orqali kurs davomida o`rganiladigan kalit so`zlar va atamalar haqida bilib olishingiz mumkin.',
    attachTo: {
      element: '.tour-step-3',
      on: 'top'
    },
    buttons: [
      {
        text: 'Tugatish',
        type: 'cancel',
        classes: backBtnClass
      },

      {
        text: 'Orqaga',
        type: 'back',
        classes: backBtnClass
      },
      {
        text: 'Keyingisi',
        type: 'next',
        classes: nextBtnClass
      }
    ]
  },
  {
    title: 'Dars qismlari',
    text: 'Har bir dars ma`ruzalar va topshiriqlardan iborat. Bir darsdan boshqasiga tugmalar orqali ham o`tsa bo`ladi.',
    attachTo: {
      element: '.tour-step-4',
      on: 'top'
    },
    buttons: [
      {
        text: 'Tugatish',
        type: 'cancel',
        classes: backBtnClass
      },

      {
        text: 'Orqaga',
        type: 'back',
        classes: backBtnClass
      },
      {
        text: 'Keyingisi',
        type: 'next',
        classes: nextBtnClass
      }
    ]
  },
  {
    title: 'Dars qismi',
    text: 'Har bir ma`ruza uchun dastur kodi berilgan. Uni ishlatib, sinab ko`rish o`ng pastdaki qora tugmani bosing. Kodni tahrirlash oynasi chiqadi. Topshiriqlar savollar va masalalardan iborat. Ularni istalgan tarzda o`rganish mumkin.',
    attachTo: {
      element: '.tour-step-5',
      on: 'top'
    },
    buttons: [
      {
        text: 'Tugatish',
        type: 'cancel',
        classes: backBtnClass
      },

      {
        text: 'Orqaga',
        type: 'back',
        classes: backBtnClass
      },
      {
        text: 'Keyingisi',
        type: 'next',
        classes: nextBtnClass
      }
    ]
  },
  {
    title: 'Muhokama',
    text: 'Ushbu tugmani bosib muhokamalar bo`limini ochish mumkin. Agarda dars haqida savol, taklif yoki shiqoyatlar bo`lsa muhokama bo`limida izoh yozib qoldiring.',
    attachTo: {
      element: '.tour-step-6',
      on: 'top'
    },
    buttons: [
      {
        text: 'Orqaga',
        type: 'back',
        classes: backBtnClass
      },
      {
        text: 'Tugatish',
        type: 'next',
        classes: nextBtnClass
      }
    ]
  },
];