"use strict";

(function () {
  var DELAY_TIME = 300; //300 мс установлено тех. заданием

  var VISIBLE_CSS = 'visible';
  var URI = 'http://localhost:3000/api/clients'; // Объект состояния клиентов (сортировка, массив объектов клиентов)

  var clientsState = {
    columnOfSort: 'id',
    // По умолчанию по тех.заданию
    stateOfSort: {
      id: true,
      fullname: false,
      createdAt: false,
      updatedAt: false
    },
    clients: []
  }; // Массив типов контактов

  var contactsTypes = ['Телефон', 'Facebook', 'VK', 'Email', 'Другое']; // Объект структуры модального окна  

  var modalWindowStructure = {
    type: 'new',
    // Может принимать значения delete, new, change
    headTitle: function headTitle() {
      var titles = {
        'delete': ' Удалить клиента',
        'new': 'Новый клиент'
      };
      return [this.type];
    },
    buttonSubmit: function buttonSubmit() {
      return this.type === 'delete' ? 'Удалить' : 'Сохранить';
    },
    button: function button() {
      return this.type === 'change' ? 'Удалить клиента' : 'Отмена';
    }
  }; // ======== Отрисовка таблицы
  // Создаем Header

  function createHeader() {
    var header = document.createElement('header');
    var logo = document.createElement('a');
    var logoImage = document.createElement('img');
    var form = document.createElement('form');
    var formInput = document.createElement('input');
    header.classList.add('header', 'header__container');
    logo.classList.add('logo');
    form.classList.add('search-form');
    formInput.classList.add('input', 'search-form__input');
    logoImage.setAttribute('src', './img/logo.svg');
    logoImage.setAttribute('alt', 'Логотип Эс Кей Би');
    form.setAttribute('action', '#');
    formInput.setAttribute('type', 'text');
    formInput.setAttribute('placeholder', 'Введите запрос');
    logo.append(logoImage);
    form.append(formInput);
    header.append(logo);
    header.append(form);
    return {
      header: header,
      form: form,
      input: formInput
    };
  }

  ; // Создаём Main и шапку таблицы

  function createTableHead() {
    var main = document.createElement('main');
    var title = document.createElement('h1');
    var tableBox = document.createElement('div');
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var headTr = document.createElement('tr');
    var headThId = document.createElement('th');
    var headThIdTitle = document.createElement('span');
    var headThIdImg = document.createElement('span');
    var headThFullname = document.createElement('th');
    var headThFullnameTitle = document.createElement('span');
    var headThFullnameImg = document.createElement('span');
    var headThFullnameDescr = document.createElement('span');
    var headThCreatedate = document.createElement('th');
    var headThCreatedateTitle = document.createElement('span');
    var headThCreatedateImg = document.createElement('span');
    var headThUpdatedate = document.createElement('th');
    var headThUpdatedateTitle = document.createElement('span');
    var headThUpdatedateImg = document.createElement('span');
    var headThContacts = document.createElement('th');
    var headThActions = document.createElement('th');
    main.classList.add('container');
    title.classList.add('main__title');
    tableBox.classList.add('table__box');
    table.classList.add('table');
    headTr.classList.add('table-head__row');
    headThId.classList.add('table-head__cells', 'table-head_id', 'table__column_sort');
    headThIdTitle.classList.add('head-id__title');
    headThIdImg.classList.add('table-head__icon');
    headThFullname.classList.add('table-head__cells', 'table-head_fullname', 'table__column_sort');
    headThFullnameTitle.classList.add('head-fullname__title');
    headThFullnameImg.classList.add('table-head__icon', 'rotate_180');
    headThFullnameDescr.classList.add('head-fullname__descr');
    headThCreatedate.classList.add('table-head__cells', 'table-head_createdate', 'table__column_sort');
    headThCreatedateTitle.classList.add('head-createdate__title');
    headThCreatedateImg.classList.add('table-head__icon', 'rotate_180');
    headThUpdatedate.classList.add('table-head__cells', 'table-head_updatedate', 'table__column_sort');
    headThUpdatedateTitle.classList.add('head-updatedate__title');
    headThUpdatedateImg.classList.add('table-head__icon', 'rotate_180');
    headThContacts.classList.add('table-head__cells');
    headThActions.classList.add('table-head__cells', 'table-head_actions');
    title.innerText = 'Клиенты';
    headThId.setAttribute('id', 'id');
    headThIdTitle.innerText = 'ID';
    headThFullname.setAttribute('id', 'fullname');
    headThFullnameTitle.innerText = 'Фамилия Имя Отчество';
    headThFullnameDescr.innerText = 'А-Я';
    headThCreatedate.setAttribute('id', 'createdAt');
    headThCreatedateTitle.innerText = 'Дата и время создания';
    headThUpdatedate.setAttribute('id', 'updatedAt');
    headThUpdatedateTitle.innerText = 'Последние изменения';
    headThContacts.setAttribute('id', 'contacts');
    headThContacts.innerText = 'Контакты';
    headThActions.setAttribute('id', 'actions');
    headThActions.innerText = 'Действия';
    headThId.append(headThIdTitle);
    headThId.append(headThIdImg);
    headThFullname.append(headThFullnameTitle);
    headThFullname.append(headThFullnameImg);
    headThFullname.append(headThFullnameDescr);
    headThCreatedate.append(headThCreatedateTitle);
    headThCreatedate.append(headThCreatedateImg);
    headThUpdatedate.append(headThUpdatedateTitle);
    headThUpdatedate.append(headThUpdatedateImg);
    headTr.append(headThId);
    headTr.append(headThFullname);
    headTr.append(headThCreatedate);
    headTr.append(headThCreatedate);
    headTr.append(headThUpdatedate);
    headTr.append(headThContacts);
    headTr.append(headThActions);
    thead.append(headTr);
    table.append(thead);
    tableBox.append(table);
    main.append(title);
    main.append(tableBox);
    return {
      main: main,
      tableBox: tableBox,
      tr: headTr
    };
  }

  ; // Создаем контейнер тела таблицы и оверлей

  function createTableBody() {
    var tableBody = document.createElement('div');
    var overlay = document.createElement('div');
    var overlayRing = document.createElement('div');
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    tableBody.classList.add('table-body');
    overlay.classList.add('table-body__overlay', 'blocked');
    overlayRing.classList.add('table-body__ring');
    table.classList.add('table', 'data-table');
    overlay.append(overlayRing);
    table.append(tbody);
    tableBody.append(overlay);
    tableBody.append(table);
    return {
      tableBody: tableBody,
      overlay: overlay
    };
  } // Создаем кнопку добавления клинета


  function createAddClientButton() {
    var buttonWrapper = document.createElement('div');
    var button = document.createElement('button');
    var text = document.createElement('span');
    var icon = document.createElement('span');
    buttonWrapper.classList.add('add-client');
    button.classList.add('add-client__btn', 'btn');
    icon.classList.add('add-client__icon');
    text.innerText = 'Добавить клиента';
    button.append(icon);
    button.append(text);
    buttonWrapper.append(button);
    return {
      wrapper: buttonWrapper,
      button: button
    };
  }

  ; // Вставляем данные в таблицу

  function insertClientsData(_ref) {
    var columnOfSort = _ref.columnOfSort,
        stateOfSort = _ref.stateOfSort,
        clients = _ref.clients;
    var tbodyElement = document.querySelector('tbody');
    var typeSortingById = stateOfSort.id,
        typeSortingByFullname = stateOfSort.fullname,
        typeSortingByCreatedAt = stateOfSort.createdAt,
        typeSortingByUpdatedAt = stateOfSort.updatedAt;
    var sortedClients = [];

    switch (columnOfSort) {
      case 'fullname':
        sortedClients = sortClientsByFullname(clients, typeSortingByFullname);
        break;

      case 'createdAt':
        sortedClients = sortClientsByDate(clients, columnOfSort, typeSortingByCreatedAt);
        break;

      case 'updatedAt':
        sortedClients = sortClientsByDate(clients, columnOfSort, typeSortingByUpdatedAt);
        break;

      default:
        sortedClients = sortClientsById(clients, typeSortingById);
    }

    ; // Очищаю данные о клиентах

    tbodyElement.innerHTML = '';
    markColumnOfSort(columnOfSort, stateOfSort); // Вставляю данные о клиентах в таблицу

    sortedClients.forEach(function (client) {
      tbodyElement.append(createRowWithClientData(client));
    }); // Разворот комбинированных контактов

    showAllContacts(tbodyElement); // Удаление клиента из таблицы

    var deleteClientButtons = tbodyElement.querySelectorAll('.delete-btn');
    deleteClientButtons.forEach(function (deleteClientbutton) {
      deleteClientbutton.addEventListener('click', function _callee() {
        var clientId, client;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                clientId = this.dataset.id; // Установил тип окна для модалки 

                modalWindowStructure.type = 'delete'; // получил данные из базы о клиенте с id

                _context.next = 4;
                return regeneratorRuntime.awrap(fetchGetClientById(this.dataset.id));

              case 4:
                client = _context.sent;
                // Вызвал модалку
                createModalWindow(client, modalWindowStructure);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, null, this);
      });
    }); // Изменить клиента из таблицы

    var changeClientButtons = tbodyElement.querySelectorAll('.edit-btn');
    changeClientButtons.forEach(function (changeClientButton) {
      changeClientButton.addEventListener('click', function _callee2() {
        var clientId, iconElement, client;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                clientId = this.dataset.id;
                iconElement = changeClientButton.querySelector('.edit-btn__icon'); // Установил тип окна для модалки 

                modalWindowStructure.type = 'change';
                iconElement.classList.add('load__icon'); // получил данные из базы о клиенте с id

                _context2.next = 6;
                return regeneratorRuntime.awrap(fetchGetClientById(clientId));

              case 6:
                client = _context2.sent;
                iconElement.classList.remove('load__icon'); // Вызвал модалку

                createModalWindow(client, modalWindowStructure);
                document.location.hash = 'id_' + clientId; // };

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, null, this);
      });
    });
  }

  ; // Создаем строку в таблице с данными клиента

  function createRowWithClientData(client) {
    var tr = document.createElement('tr');
    var tdId = document.createElement('td');
    var tdFullname = document.createElement('td');
    var tdCreateDate = document.createElement('td');
    var wrapCreateDate = document.createElement('div');
    var createDate = document.createElement('span');
    var createTime = document.createElement('span');
    var tdUpdateDate = document.createElement('td');
    var wrapUpdateDate = document.createElement('div');
    var updateDate = document.createElement('span');
    var updateTime = document.createElement('span');
    var tdContacts = document.createElement('td');
    var ulContacts = createContactList(client.contacts);
    var tdActions = document.createElement('td');
    var wrapActions = document.createElement('div');
    var buttonEdit = document.createElement('button');
    var buttonEditImg = document.createElement('span');
    var buttonEditText = document.createElement('span');
    var buttonDelete = document.createElement('button');
    var buttonDeleteImg = document.createElement('span');
    var buttonDeleteText = document.createElement('span');
    tr.classList.add('table__row');
    tdId.classList.add('row__cells', 'body-cells_id');
    tdFullname.classList.add('row__cells', 'body-cells_fullname');
    tdCreateDate.classList.add('row__cells');
    wrapCreateDate.classList.add('cell-create__wrapper');
    createDate.classList.add('cell-create__date');
    createTime.classList.add('cell-create__time');
    tdUpdateDate.classList.add('row__cells');
    wrapUpdateDate.classList.add('cell-update__wrapper');
    updateDate.classList.add('cell-update__date');
    updateTime.classList.add('cell-update__time');
    tdContacts.classList.add('row__cells');
    tdActions.classList.add('row__cells');
    wrapActions.classList.add('actions__wrapper');
    buttonEdit.classList.add('edit-btn', 'btn');
    buttonEditImg.classList.add('actions-btn__icon', 'edit-btn__icon');
    buttonEditText.classList.add('edit-btn__text');
    buttonDelete.classList.add('delete-btn', 'btn');
    buttonDeleteImg.classList.add('actions-btn__icon', 'delete-btn__icon');
    buttonDeleteText.classList.add('delete-btn__text');
    tr.setAttribute('id', client.id); // Для поиска клиентов в таблице и скролла к ним

    buttonEdit.setAttribute('data-id', client.id);
    buttonDelete.setAttribute('data-id', client.id);
    tdId.innerText = client.id.slice(-6);
    tdFullname.innerText = "".concat(client.surname.trim(), " ").concat(client.name.trim(), " ").concat(client.lastName.trim());
    createDate.innerText = formatDate(client.createdAt);
    createTime.innerText = formatTime(client.createdAt);
    updateDate.innerText = formatDate(client.updatedAt);
    updateTime.innerText = formatTime(client.updatedAt);
    buttonEditText.innerText = 'Изменить';
    buttonDeleteText.innerText = 'Удалить';
    wrapCreateDate.append(createDate);
    wrapCreateDate.append(createTime);
    tdCreateDate.append(wrapCreateDate);
    wrapUpdateDate.append(updateDate);
    wrapUpdateDate.append(updateTime);
    tdUpdateDate.append(wrapUpdateDate);
    tdContacts.append(ulContacts);
    buttonEdit.append(buttonEditImg);
    buttonEdit.append(buttonEditText);
    buttonDelete.append(buttonDeleteImg);
    buttonDelete.append(buttonDeleteText);
    wrapActions.append(buttonEdit);
    wrapActions.append(buttonDelete);
    tdActions.append(wrapActions);
    tr.append(tdId);
    tr.append(tdFullname);
    tr.append(tdCreateDate);
    tr.append(tdUpdateDate);
    tr.append(tdContacts);
    tr.append(tdActions);
    return tr;
  } // Получаем дату из json


  function formatDate(str) {
    return str.slice(8, 10) + '.' + str.slice(5, 7) + '.' + str.slice(0, 4);
  } // Получаем время из json


  function formatTime(str) {
    return str.slice(11, 16);
  } // Создаем список контактов клиента


  function createContactList(contacts) {
    var ul = document.createElement('ul');
    ul.classList.add('contacts__list');
    var amountOfContacts = contacts.length;
    var visible = true;
    contacts.forEach(function (contact, index) {
      if (index === 4 && amountOfContacts > 5) {
        var li = document.createElement('li');
        var span = document.createElement('span');
        li.classList.add('contacts__item');
        span.classList.add('contacts__icon_ring');
        li.setAttribute('id', 'comb');
        span.setAttribute('data-value', 'Развернуть');
        span.innerText = '+' + (amountOfContacts - 1 - index);
        li.append(span);
        ul.append(li);
        visible = false;
      }

      ul.append(createContactItem(contact, visible));
    });
    return ul;
  }

  ; // Функция создает li элемент для иконок списка контактов

  function createContactItem(contact, visible) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    li.classList.add('contacts__item');

    if (!visible) {
      li.classList.add('blocked');
    }

    ;
    img.classList.add('contacts__icon');

    if (contact.type === 'Другое') {
      img.setAttribute('data-type', '');
    } else {
      img.setAttribute('data-type', contact.type + ':');
    }

    ;
    img.setAttribute('data-value', contact.value);

    switch (contact.type) {
      case 'Телефон':
        img.setAttribute('src', './img/phone.svg');
        img.setAttribute('alt', 'Телефон');
        break;

      case 'Facebook':
        img.setAttribute('src', './img/fb.svg');
        img.setAttribute('alt', 'Фэйсбук');
        break;

      case 'VK':
        img.setAttribute('src', './img/vk.svg');
        img.setAttribute('alt', 'В контактах');
        break;

      case 'Email':
        img.setAttribute('src', './img/mail.svg');
        img.setAttribute('alt', 'Имэйл');
        break;

      default:
        img.setAttribute('src', './img/other.svg');
        img.setAttribute('alt', 'Другое');
    }

    ;
    li.append(img);
    return li;
  }

  ; // ======= Функции активностей в таблице
  // Сортировка данных в таблице в первом аргументе объект, во втоом tableHead.tr

  function sortDataInTable(clientsState, tableHeadElement) {
    var thElements = tableHeadElement.querySelectorAll('.table__column_sort');
    thElements.forEach(function (thElement) {
      thElement.addEventListener('click', function () {
        clientsState.columnOfSort = thElement.id;

        if (clientsState.stateOfSort[thElement.id]) {
          clientsState.stateOfSort[thElement.id] = false;
        } else {
          clientsState.stateOfSort[thElement.id] = true;
        }

        ;
        insertClientsData(clientsState);
      });
    });
  }

  ; // Сорировка списка клиентов по полю ID

  function sortClientsById(clients, ascending) {
    if (ascending) {
      return clients.sort(function (a, b) {
        return a.id > b.id ? 1 : -1;
      });
    }

    ;
    return clients.sort(function (a, b) {
      return a.id < b.id ? 1 : -1;
    });
  }

  ; // Сортировка списка клиентов по полю Ф.И.О.

  function sortClientsByFullname(clients, ascending) {
    if (ascending) {
      return clients.sort(function (a, b) {
        return a.surname.trim().toLowerCase() + a.name.trim().toLowerCase() + a.lastName.trim().toLowerCase() < b.surname.trim().toLowerCase() + b.name.trim().toLowerCase() + b.lastName.trim().toLowerCase() ? 1 : -1;
      });
    }

    ;
    return clients.sort(function (a, b) {
      return a.surname.trim().toLowerCase() + a.name.trim().toLowerCase() + a.lastName.trim().toLowerCase() > b.surname.trim().toLowerCase() + b.name.trim().toLowerCase() + b.lastName.trim().toLowerCase() ? 1 : -1;
    });
  }

  ; // Сорировка списка клиентов по полю Дата и время создания

  function sortClientsByDate(clients, field, ascending) {
    if (ascending) {
      return clients.sort(function (a, b) {
        return new Date(a[field]).getTime() > new Date(b[field]).getTime() ? 1 : -1;
      });
    }

    ;
    return clients.sort(function (a, b) {
      return new Date(a[field]).getTime() < new Date(b[field]).getTime() ? 1 : -1;
    });
  }

  ; // Маркировка столбца сортировки

  function markColumnOfSort(columnOfSort, stateOfSort) {
    var columns = document.querySelectorAll('.table__column_sort');
    columns.forEach(function (column) {
      if (column.id === columnOfSort) {
        column.childNodes[0].classList.add('color_light-slate-blue');
      } else {
        column.childNodes[0].classList.remove('color_light-slate-blue');
      }

      ;

      if (stateOfSort[column.id]) {
        column.childNodes[1].classList.remove('rotate_180');

        if (column.id === 'fullname') {
          column.childNodes[2].innerText = 'Я-А';
        }

        ;
      } else {
        column.childNodes[1].classList.add('rotate_180');

        if (column.id === 'fullname') {
          column.childNodes[2].innerText = 'А-Я';
        }

        ;
      }

      ;
    });
  }

  ; // Показываю тултипы [data-type] и [data-value]

  function showTooltips() {
    var tooltipElememt;
    var tooltipTypeElement;
    var tooltipValueElement;
    document.addEventListener('mouseover', function (event) {
      var target = event.target;
      var tooltipType = target.dataset.type;
      var tooltipValue = target.dataset.value;
      if (!tooltipType && !tooltipValue) return;
      tooltipElememt = document.createElement('div');
      tooltipValueElement = document.createElement('span');
      tooltipElememt.classList.add('tooltip');
      tooltipValueElement.classList.add('tooltip__value');

      if (tooltipType) {
        tooltipTypeElement = document.createElement('span');
        tooltipTypeElement.classList.add('tooltip__title');
        tooltipTypeElement.innerText = tooltipType;
        tooltipElememt.append(tooltipTypeElement);
        tooltipValueElement.classList.add('color_light-slate-blue');
      }

      ;
      tooltipValueElement.innerText = tooltipValue;
      tooltipElememt.append(tooltipValueElement);
      document.body.append(tooltipElememt);
      var coords = target.getBoundingClientRect();
      var left = coords.left + (target.offsetWidth - tooltipElememt.offsetWidth) / 2;
      if (left < 0) left = 0;
      var top = coords.top - tooltipElememt.offsetHeight - 10;

      if (top < 0) {
        // если подсказка не помещается сверху, то отображать её снизу
        top = coords.top + target.offsetHeight + 10;
      }

      ;
      tooltipElememt.style.left = left + 'px';
      tooltipElememt.style.top = top + 'px';
      tooltipElememt.style.opacity = 1;
    });
    document.addEventListener('mouseout', function () {
      if (tooltipElememt) {
        tooltipElememt.remove();
        tooltipElememt = null;
      }

      ;
    });
  }

  ; // Показываю все контакты клинета по нажатию на Comb кнопку

  function showAllContacts(tbodyElement) {
    var combElements = tbodyElement.querySelectorAll('#comb');
    combElements.forEach(function (combElement) {
      combElement.addEventListener('click', function () {
        var contactsElements = combElement.parentNode.querySelectorAll('.contacts__item');
        contactsElements.forEach(function (contactsElement) {
          if (contactsElement.id) {
            contactsElement.classList.add('blocked');
          } else {
            contactsElement.classList.remove('blocked');
          }

          ;
        });
      });
    });
  }

  ; // ========= Отрисовка модального окна
  // Собираю модалку

  function createModalWindow(client, modalWindowStructure) {
    var id = client.id,
        surname = client.surname,
        name = client.name,
        lastName = client.lastName,
        contacts = client.contacts;
    var typeOfModal = modalWindowStructure.type,
        buttonSubmitText = modalWindowStructure.buttonSubmit,
        buttonSmallText = modalWindowStructure.button; // Создал контейнер

    var modal = document.createElement('div');
    var wrapper = document.createElement('div');
    var buttonWindowClose = document.createElement('span');
    modal.classList.add('modal');
    wrapper.classList.add('modal__wrapper');
    buttonWindowClose.classList.add('modal__close');
    buttonWindowClose.setAttribute('data-btn', 'close');
    wrapper.append(buttonWindowClose); // Создал шапку модалки header элемент
    // ID передаём только в модалку по изменению данных клиента

    var idValue = null;

    if (typeOfModal === 'change') {
      idValue = id;
    }

    ;
    var headerElement = createHeadOfModal(modalWindowStructure.headTitle(), idValue);
    wrapper.append(headerElement.header); //вставил шапку
    // Создал контейнер формы

    var formElement = document.createElement('form');
    formElement.classList.add('modal__form');
    formElement.setAttribute('action', '#'); // Создал Блок ошибок

    var blockError = createErrorForModal(); // Создал части формы

    if (typeOfModal !== 'delete') {
      // Создал Блок с ФИО клиента
      var clietntNameElement = createClientNameForModal(surname, name, lastName);
      formElement.append(clietntNameElement); // Создал Блок с контактами клиента

      var _createClientContacts = createClientContactsForModal(contacts),
          fieldsetContacts = _createClientContacts.fieldsetContacts,
          buttonAddContactElement = _createClientContacts.buttonAddContactElement,
          wrapperContacts = _createClientContacts.wrapperContacts;

      formElement.append(fieldsetContacts);
      wrapper.append(formElement); // Добавил переключатель активна/неактивна кнопка "Добавить контакт" (по кол-ву контактов)

      disabledButtonAddContact(buttonAddContactElement, fieldsetContacts); // Добавление нового клиента при нажатии на кнопку

      addNewContact(buttonAddContactElement, wrapperContacts); // Удаление контакта клиента при нажатии на кнопку

      deleteContact(buttonAddContactElement, wrapperContacts); // Добавил переключатель активна/неактивна кнопка "Удалить контакт" при условии наличия данных в инпуте 

      checkValueInInputs(wrapperContacts); // Добавил Блок Ошибок

      wrapper.append(blockError.wrapperError);
    } else {
      // Добавил Блок Ошибок
      wrapper.append(blockError.wrapperError); // Показал его

      blockError.wrapperError.classList.remove('blocked'); // Записал значение ошибки/предупреждения

      blockError.spanError.textContent = 'Вы действительно хотите удалить данного клиента?'; // Меняем цвет блока ошибок

      blockError.spanError.classList.add('modal-error__text-style'); // Выравнивание заголовка шапки посредине

      headerElement.header.classList.add('align-center', 'modal-header-margin-bottom');
      headerElement.headerTitle.classList.add('modal-header__heading-padding-top');
    }

    ; // Создал блок кнопок

    var buttonsElement = createButtonsForModal(modalWindowStructure.buttonSubmit(), modalWindowStructure.button());
    wrapper.append(buttonsElement.wrapperButtons);
    modal.append(wrapper);
    document.body.append(modal); // Обработчики событий
    // Нажатие на Esc

    document.addEventListener('keydown', function (event) {
      if (event.code == "Escape") {
        onClose(modal, wrapper);
      }

      ;
    }); // Клик на иконку закрытия окна

    buttonWindowClose.addEventListener('click', function () {
      onClose(modal);
    }); // Клик на оверлей

    modal.addEventListener('click', function (event) {
      if (!event.target.classList.contains('modal')) {
        return;
      }

      onClose(modal);
    }); // Клик на большую кнопку

    buttonsElement.buttonSubmit.addEventListener('click', function _callee3() {
      var clientValues, iconButtonSubmit;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeOfModal == 'delete')) {
                _context3.next = 4;
                break;
              }

              onDelete(id, modal); // Удаляем клиента из базы по ID

              _context3.next = 24;
              break;

            case 4:
              // Собираем данные из формы здесь же можно установить в disabled
              clientValues = getValuesFromModal(modal); // Есть ли ошибки при заполнении формы?

              if (clientValues.textError) {
                _context3.next = 22;
                break;
              }

              iconButtonSubmit = buttonsElement.buttonSubmit.querySelector('.submit-btn__icon'); // Ставим лоадер на кнопку

              iconButtonSubmit.classList.add('upload_visible'); // Устанавливаем disabled на форму

              setDisabledOnElementsOfForm(modal, true);

              if (!(typeOfModal == 'new')) {
                _context3.next = 14;
                break;
              }

              _context3.next = 12;
              return regeneratorRuntime.awrap(onSave(clientValues, modal));

            case 12:
              _context3.next = 17;
              break;

            case 14:
              if (!(typeOfModal == 'change')) {
                _context3.next = 17;
                break;
              }

              _context3.next = 17;
              return regeneratorRuntime.awrap(onUpdate(clientValues, idValue, modal));

            case 17:
              ; //Убираем лоадер с кнопки

              iconButtonSubmit.classList.remove('upload_visible'); // Снимаем disabled

              setDisabledOnElementsOfForm(modal, false);
              _context3.next = 24;
              break;

            case 22:
              blockError.wrapperError.classList.remove('blocked');
              blockError.spanError.innerHTML = clientValues.textError;

            case 24:
              ;

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      });
    }); // Клик на маленькую кнопку

    buttonsElement.buttonSmall.addEventListener('click', function () {
      if (typeOfModal !== 'change') {
        onClose(modal);
      } else {
        onDelete(id, modal); // Удаляем клиента из базы по ID
      }

      ;
    }); // Добавил открытие дропдауна при нажатии на кнопку

    showDropDown(modal);
    var timeoutId = setTimeout(function () {
      modal.classList.add(VISIBLE_CSS);
      wrapper.classList.add(VISIBLE_CSS);
    }, 100);
    return modal;
  }

  ; // Проверка наличия контактов и добавления в блок паддингов

  function setPaddingToContacrsWrap() {
    var contactsWrap = document.querySelector('.modal-contacts');

    if (contactsWrap) {
      var contactsElements = contactsWrap.querySelectorAll('.modal-contacts__item');

      if (!contactsElements.length) {
        contactsWrap.classList.remove('modal-contacts_padding');
      } else {
        contactsWrap.classList.add('modal-contacts_padding');
      }

      ;
    }

    ;
  }

  ; // Шапка модалки

  function createHeadOfModal(title, idValue) {
    var header = document.createElement('div');
    var headerTitle = document.createElement('h2');
    header.classList.add('modal__header', 'modal__container');
    headerTitle.classList.add('modal-header__heading');
    headerTitle.textContent = title;
    header.append(headerTitle);

    if (idValue) {
      var headerInfo = document.createElement('span');
      headerInfo.classList.add('modal-header__id');
      headerInfo.innerText = "ID: ".concat(idValue.slice(-6));
      header.append(headerInfo);
    }

    return {
      header: header,
      headerTitle: headerTitle
    };
  }

  ; // Создал часть формы с ФИО клиента

  function createClientNameForModal(surname, name, lastName) {
    var fieldsetClientName = document.createElement('fieldset');
    var wrapperClientName = document.createElement('div');
    var wrapperSurname = document.createElement('div');
    var inputSurname = document.createElement('input');
    var lableSurname = document.createElement('lable');
    var asterixSurname = document.createElement('span');
    var wrapperName = document.createElement('div');
    var inputName = document.createElement('input');
    var lableName = document.createElement('lable');
    var asterixName = document.createElement('span');
    var wrapperLastname = document.createElement('div');
    var inputLastname = document.createElement('input');
    var lableLastname = document.createElement('lable');
    fieldsetClientName.classList.add('fieldset_reset', 'modal-fullname');
    wrapperClientName.classList.add('modal__container', 'modal-contaiter_position_flex');
    wrapperSurname.classList.add('inputs__wrap');
    inputSurname.classList.add('input', 'modal__intup');
    lableSurname.classList.add('modal__lable');
    asterixSurname.classList.add('lable_asterix');
    wrapperName.classList.add('inputs__wrap');
    inputName.classList.add('input', 'modal__intup');
    lableName.classList.add('modal__lable');
    asterixName.classList.add('lable_asterix');
    wrapperLastname.classList.add('inputs__wrap');
    inputLastname.classList.add('input', 'modal__intup');
    lableLastname.classList.add('modal__lable');
    inputSurname.setAttribute('id', 'surname');
    inputSurname.setAttribute('data-input', 'surname');
    inputSurname.setAttribute('type', 'text');
    inputSurname.setAttribute('name', 'surname');
    lableSurname.setAttribute('for', 'surname');
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('data-input', 'name');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('name', 'name');
    lableName.setAttribute('for', 'name');
    inputLastname.setAttribute('id', 'lastname');
    inputLastname.setAttribute('data-input', 'lastname');
    inputLastname.setAttribute('type', 'text');
    inputLastname.setAttribute('name', 'lastname');
    lableLastname.setAttribute('for', 'lastname');
    lableSurname.textContent = 'Фамилия';
    asterixSurname.textContent = '*';
    lableName.textContent = 'Имя';
    asterixName.textContent = '*';
    lableLastname.textContent = 'Отчество';

    if (surname) {
      lableSurname.classList.add('modal__lable_up');
      inputSurname.value = surname;
    }

    ;

    if (name) {
      lableName.classList.add('modal__lable_up');
      inputName.value = name;
    }

    ;

    if (lastName) {
      lableLastname.classList.add('modal__lable_up');
      inputLastname.value = lastName;
    }

    ;
    lableSurname.append(asterixSurname);
    lableName.append(asterixName);
    wrapperSurname.append(lableSurname);
    wrapperSurname.append(inputSurname);
    wrapperName.append(lableName);
    wrapperName.append(inputName);
    wrapperLastname.append(lableLastname);
    wrapperLastname.append(inputLastname);
    wrapperClientName.append(wrapperSurname);
    wrapperClientName.append(wrapperName);
    wrapperClientName.append(wrapperLastname);
    fieldsetClientName.append(wrapperClientName); // Навешиваю обработчики на inputs для сброса стилизации ошибок

    inputSurname.addEventListener('input', function () {
      inputSurname.parentNode.classList.remove('border-color_burnt-sienna');
    });
    inputName.addEventListener('input', function () {
      inputName.parentNode.classList.remove('border-color_burnt-sienna');
    }); // Подъем lables

    showInpunsUnderLables(wrapperClientName);
    return fieldsetClientName;
  } // Функция подъёма label если фокус на input


  function showInpunsUnderLables(wrapperClientName) {
    var inputs = wrapperClientName.querySelectorAll('.inputs__wrap');
    inputs.forEach(addListenersOnInput);
  }

  ; // Добавил обработчики событий на инпут 

  function addListenersOnInput(input) {
    var inputElement = input.querySelector('.modal__intup');
    var lableElement = input.querySelector('.modal__lable');
    inputElement.addEventListener('focus', function () {
      lableElement.classList.add('modal__lable_up');
    });
    inputElement.addEventListener('blur', function () {
      if (!inputElement.value) {
        lableElement.classList.remove('modal__lable_up');
      }

      ;
    });
  }

  ; // Создал часть формы с контактами клиента

  function createClientContactsForModal(contacts) {
    var fieldsetContacts = document.createElement('fieldset');
    var wrapperContacts = document.createElement('div');
    var listOfContacts = document.createElement('ul');
    fieldsetContacts.classList.add('modal-contacts', 'fieldset_reset');
    wrapperContacts.classList.add('modal__container');
    listOfContacts.classList.add('modal-contacts__list');
    wrapperContacts.append(listOfContacts);

    if (contacts) {
      contacts.forEach(function (contact) {
        var contactItem = createContactForModal(contact);
        listOfContacts.append(contactItem);
      });
    }

    ; // Стилизация блока контактов

    setTimeout(setPaddingToContacrsWrap, 300); // Кнопка добавить клиента    

    var buttonAddContactElement = createButtonAddContactForModal();
    fieldsetContacts.append(wrapperContacts);
    fieldsetContacts.append(buttonAddContactElement);
    return {
      fieldsetContacts: fieldsetContacts,
      buttonAddContactElement: buttonAddContactElement,
      wrapperContacts: wrapperContacts
    };
  }

  ; // Создал элемент списка контактов с кнопкой "Удалить"

  function createContactForModal(contact) {
    var contactItem = document.createElement('li');
    var wrapContactType = document.createElement('div');
    var buttonContactType = document.createElement('button');
    var listContactTypeDropdown = document.createElement('ul');
    var inputContactValue = document.createElement('input');
    var buttonContactDelete = document.createElement('button');
    var buttonContactDeleteIcon = document.createElement('span');
    contactItem.classList.add('modal-contacts__item');
    wrapContactType.classList.add('contacts-type');
    buttonContactType.classList.add('contact-type__button', 'btn');
    listContactTypeDropdown.classList.add('contact-type__list');
    inputContactValue.classList.add('input', 'contact-value', 'contact-value_border-right');
    inputContactValue.setAttribute('type', 'text');
    inputContactValue.setAttribute('placeholder', 'Введите данные контакта');
    buttonContactDelete.classList.add('delete-contact__btn', 'btn', 'blocked');
    buttonContactDeleteIcon.classList.add('delete-contact__icon');
    buttonContactType.textContent = 'Тип контакта';
    contactsTypes.forEach(function (contactsType) {
      var item = document.createElement('li');
      item.classList.add('contact-type__item');
      item.textContent = contactsType;
      listContactTypeDropdown.append(item);
    });

    if (contact) {
      buttonContactType.textContent = contact.type;
      inputContactValue.value = contact.value;
      buttonContactDelete.classList.remove('blocked');
    }

    ;
    buttonContactDelete.append(buttonContactDeleteIcon);
    wrapContactType.append(buttonContactType);
    wrapContactType.append(listContactTypeDropdown);
    contactItem.append(wrapContactType);
    contactItem.append(inputContactValue);
    contactItem.append(buttonContactDelete); // Вешаю на ipnut слушателя чтобы убрать стили сигнализации об ошибке

    inputContactValue.addEventListener('input', function () {
      inputContactValue.classList.remove('border-color_burnt-sienna');
    });
    return contactItem;
  }

  ; // Создал кнопку добавления контакта 

  function createButtonAddContactForModal() {
    var buttonAddContact = document.createElement('button');
    var buttonAddContactIcon = document.createElement('span');
    var buttonAddContactTitle = document.createElement('span');
    buttonAddContact.classList.add('modal-addcontact__btn', 'btn', VISIBLE_CSS);
    buttonAddContactIcon.classList.add('modal-addcontact__icon');
    buttonAddContactTitle.classList.add('modal-addcontact__title');
    buttonAddContact.setAttribute('data-btn', 'contact-add');
    buttonAddContactTitle.textContent = 'Добавить контакт';
    buttonAddContact.append(buttonAddContactIcon);
    buttonAddContact.append(buttonAddContactTitle);
    return buttonAddContact;
  } // Создал блок с выводом ошибок и др. инфорации


  function createErrorForModal() {
    var wrapperError = document.createElement('div');
    var spanError = document.createElement('span');
    wrapperError.classList.add('modal-error', 'blocked');
    spanError.classList.add('modal-error__text');
    wrapperError.classList.remove('blocked');
    wrapperError.append(spanError);
    return {
      wrapperError: wrapperError,
      spanError: spanError
    };
  }

  ; // Создал блок кнопок модалки

  function createButtonsForModal(submitTitle, smallTitle) {
    var wrapperButtons = document.createElement('div');
    var buttonSubmit = document.createElement('button');
    var buttonSubmitIcon = document.createElement('span');
    var buttonSubmitTitle = document.createElement('span');
    var buttonSmall = document.createElement('button');
    wrapperButtons.classList.add('modal-btns');
    buttonSubmit.classList.add('submit-btn', 'btn');
    buttonSubmitIcon.classList.add('submit-btn__icon');
    buttonSubmitTitle.classList.add('submit-btn__title');
    buttonSmall.classList.add('modal-delete-btn', 'btn');
    buttonSubmit.setAttribute('data-btn', 'submit');
    buttonSmall.setAttribute('data-btn', 'small');
    buttonSubmitTitle.textContent = submitTitle;
    buttonSmall.textContent = smallTitle;
    buttonSubmit.append(buttonSubmitIcon);
    buttonSubmit.append(buttonSubmitTitle);
    wrapperButtons.append(buttonSubmit);
    wrapperButtons.append(buttonSmall);
    return {
      wrapperButtons: wrapperButtons,
      buttonSubmit: buttonSubmit,
      buttonSmall: buttonSmall
    };
  }

  ; // Считаю количество контактов если 10 деактивируем кнопку Добавить контакт

  function disabledButtonAddContact(buttonAddContact, wrapper) {
    var items = wrapper.querySelectorAll('.modal-contacts__item');

    if (items.length >= 10) {
      buttonAddContact.classList.remove(VISIBLE_CSS);
    } else {
      buttonAddContact.classList.add(VISIBLE_CSS);
    }

    ;
  }

  ; //Развернул дропдаун

  function showDropDown(modalElement) {
    var dropdowns = modalElement.querySelectorAll('.contacts-type');
    dropdowns.forEach(function (dropdown) {
      setEventsOnDropdown(dropdown);
    });
  }

  ; // Добавление слушателей к элементам дропдауна

  function setEventsOnDropdown(dropdown) {
    var buttonDropdown = dropdown.querySelector('.contact-type__button');
    var listDropdown = dropdown.querySelector('.contact-type__list');
    var itemsDropdown = listDropdown.querySelectorAll('.contact-type__item'); // Отслеживаем клик на кнопке (открыть/закрыть список)

    buttonDropdown.addEventListener('click', function (event) {
      event.preventDefault();
      listDropdown.classList.toggle('contact-type__list_visible');
      buttonDropdown.classList.toggle('contact-type__button_rotate');
    }); // Отслеживаем клик по элементам списка и присваивание значения кнопке

    itemsDropdown.forEach(function (item) {
      item.addEventListener('click', function (event) {
        event.stopPropagation(); // Удаляю стили индикации об ошибке

        buttonDropdown.classList.remove('border-color_burnt-sienna');
        buttonDropdown.textContent = this.innerText;
        buttonDropdown.focus();
        hidenDropdown(listDropdown, buttonDropdown);
      });
    }); // Клик снаружи дропдауна. Закрыть дропдаун

    document.addEventListener('click', function (event) {
      if (event.target !== buttonDropdown) {
        hidenDropdown(listDropdown, buttonDropdown);
      }

      ;
    }); // Нажатие на Таб или Эскейп. Закрыть дропдаун

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Tab' || event.key === 'Escape') {
        hidenDropdown(listDropdown, buttonDropdown);
      }

      ;
    });
  }

  ; // В функции setEventsOnDropdown повторение кода - удаление свойст показа списка дропдауна

  function hidenDropdown(listDropdown, buttonDropdown) {
    listDropdown.classList.remove('contact-type__list_visible');
    buttonDropdown.classList.remove('contact-type__button_rotate');
  }

  ; // Добавление события ввода данных в инпуты контактов

  function checkValueInInputs(modalElement) {
    var contacts = modalElement.querySelectorAll('.modal-contacts__item');
    contacts.forEach(function (contact) {
      setEventsOnInput(contact);
    });
  }

  ; // В функции checkValueInInputs повторение кода - установка видимости кнопки "Удалить контакт"

  function setEventsOnInput(element) {
    var buttonDeleteContact = element.querySelector('.delete-contact__btn');
    var inputContact = element.querySelector('.contact-value');
    element.addEventListener('input', function (event) {
      event.stopPropagation();

      if (inputContact.value) {
        buttonDeleteContact.classList.remove('blocked');
      } else {
        buttonDeleteContact.classList.add('blocked');
      }

      ;
    });
  }

  ; // Добавляем новый контакт клиенту

  function addNewContact(buttonAddContact, wrapperContacts) {
    var listContacts = wrapperContacts.querySelector('.modal-contacts__list');
    buttonAddContact.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var contactItem = createContactForModal('');
      listContacts.append(contactItem); // Стилизация блока контактов

      setPaddingToContacrsWrap(); // Добавил новому элементу события для дропдауна

      setEventsOnDropdown(contactItem); // Добавил новому элементу событие на ввод данных

      setEventsOnInput(contactItem); // Добавил новому элементу событие на кнопку "Удалить контакт"

      setEventOnButtonDeleteContact(contactItem, buttonAddContact, wrapperContacts);
      disabledButtonAddContact(buttonAddContact, wrapperContacts);
    });
  }

  ; // Удаляем контакт по кнопке

  function deleteContact(buttonAddContact, wrapperContacts) {
    var deleteButtons = wrapperContacts.querySelectorAll('.modal-contacts__item');
    deleteButtons.forEach(function (deleteButton) {
      setEventOnButtonDeleteContact(deleteButton, buttonAddContact, wrapperContacts);
    });
  }

  ; // Навешиваю событие клик на кнопку удаления контакта

  function setEventOnButtonDeleteContact(element, buttonAddContact, wrapperContacts) {
    var deleteButton = element.querySelector('.delete-contact__btn');
    deleteButton.addEventListener('click', function () {
      element.remove();
      disabledButtonAddContact(buttonAddContact, wrapperContacts); // // Стилизация блока контактов

      setPaddingToContacrsWrap();
    });
  }

  ; // Получаю данные формы модального окна

  function getValuesFromModal(modal) {
    var textError = '';
    var surnameElement = modal.querySelector('#surname');
    var surname = surnameElement.value.trim();

    if (!surname) {
      surnameElement.parentNode.classList.add('border-color_burnt-sienna');
      textError = 'Введите фамилию клиента';
    }

    ;
    var nameElement = modal.querySelector('#name');
    var name = nameElement.value.trim();

    if (!name) {
      nameElement.parentNode.classList.add('border-color_burnt-sienna');

      if (textError) {
        textError = textError + '<br>';
      }

      textError = textError + 'Введите имя клиента';
    }

    ;
    var lastNameElement = modal.querySelector('#lastname');
    var lastName = lastNameElement.value.trim();
    var contacts = [];
    var contactsItems = modal.querySelectorAll('.modal-contacts__item');
    contactsItems.forEach(function (contactsItem) {
      var typeElement = contactsItem.querySelector('.contact-type__button');
      var type = typeElement.innerText;

      if (type === 'Тип контакта') {
        typeElement.classList.add('border-color_burnt-sienna');

        if (textError) {
          textError = textError + '<br>';
        }

        textError = textError + 'Установите тип контакта';
      }

      var valueElement = contactsItem.querySelector('.contact-value');
      var value = valueElement.value.trim();

      if (!value) {
        valueElement.classList.add('border-color_burnt-sienna');

        if (textError) {
          textError = textError + '<br>';
        }

        textError = textError + 'Введите данные контакта';
      }

      var objContact = {
        type: type,
        value: value
      };
      contacts.push(objContact);
    });
    return {
      name: name,
      surname: surname,
      lastName: lastName,
      contacts: contacts,
      textError: textError
    };
  }

  ; // Установка/снятие disabled с полей формы

  function setDisabledOnElementsOfForm(modal, disabledElements) {
    var modalInputs = modal.querySelectorAll('.modal__intup');
    var contactsItems = modal.querySelectorAll('.modal-contacts__item');
    var buttonAddContact = modal.querySelector('.modal-addcontact__btn');
    var buttonSubmit = modal.querySelector('.submit-btn');
    var buttonSmall = modal.querySelector('.modal-delete-btn');

    if (disabledElements) {
      modalInputs.forEach(function (modalInput) {
        modalInput.disabled = true;
      });
      contactsItems.forEach(function (contactsItem) {
        var typeElement = contactsItem.querySelector('.contact-type__button');
        var valueElement = contactsItem.querySelector('.contact-value');
        var buttonDeleteContact = contactsItem.querySelector('.delete-contact__btn');
        typeElement.disabled = true;
        valueElement.disabled = true;
        buttonDeleteContact.disabled = true;
      });
      buttonAddContact.disabled = true;
      buttonSubmit.disabled = true;
      buttonSmall.disabled = true;
    } else {
      modalInputs.forEach(function (modalInput) {
        modalInput.disabled = false;
      });
      contactsItems.forEach(function (contactsItem) {
        var typeElement = contactsItem.querySelector('.contact-type__button');
        var valueElement = contactsItem.querySelector('.contact-value');
        var buttonDeleteContact = contactsItem.querySelector('.delete-contact__btn');
        typeElement.disabled = false;
        valueElement.disabled = false;
        buttonDeleteContact.disabled = false;
      });
      buttonAddContact.disabled = false;
      buttonSubmit.disabled = false;
      buttonSmall.disabled = false;
    }

    ;
  }

  ; // Закрываю модалку  

  function onClose(modal) {
    var wrapper = modal.querySelector('.modal__wrapper');
    modal.classList.remove(VISIBLE_CSS);
    wrapper.classList.remove(VISIBLE_CSS);
    var timeoutId = setTimeout(function () {
      modal.remove();
    }, DELAY_TIME);
    document.location.hash = '';
  }

  ; // Удаляю клиента

  function onDelete(clientId, modal) {
    var response;
    return regeneratorRuntime.async(function onDelete$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(fetchDeleteClient(clientId));

          case 2:
            response = _context4.sent;
            httpErrorHandler(response, modal);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    });
  }

  ; // Добавляю нового клиента 

  function onSave(client, modal) {
    var response;
    return regeneratorRuntime.async(function onSave$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(fetchAddClient(client));

          case 2:
            response = _context5.sent;
            httpErrorHandler(response, modal);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    });
  }

  ; // Обновляю данные клиента

  function onUpdate(сlient, clientId, modal) {
    var response;
    return regeneratorRuntime.async(function onUpdate$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(fetchUpdateClient(сlient, clientId));

          case 2:
            response = _context6.sent;
            httpErrorHandler(response, modal);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    });
  }

  ; // Обработка HTTP ошибок 

  function httpErrorHandler(response, modal) {
    var info, wrapperError, spanError, errors;
    return regeneratorRuntime.async(function httpErrorHandler$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            wrapperError = modal.querySelector('.modal-error');
            spanError = wrapperError.querySelector('.modal-error__text');

            if (!(response.status === 200 || response.status === 201)) {
              _context7.next = 8;
              break;
            }

            _context7.next = 5;
            return regeneratorRuntime.awrap(updateClientsInTable());

          case 5:
            onClose(modal);
            _context7.next = 30;
            break;

          case 8:
            if (!(modalWindowStructure.type !== 'delete')) {
              _context7.next = 29;
              break;
            }

            if (!(response.status === 500)) {
              _context7.next = 13;
              break;
            }

            info = "\u0414\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B. \u041E\u0442\u0432\u0435\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 - ".concat(response.status, ". \u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0431\u043E\u0442\u044B \u0441\u0435\u0440\u0432\u0435\u0440\u0430.");
            _context7.next = 26;
            break;

          case 13:
            _context7.t0 = response.status;
            _context7.next = _context7.t0 === 404 ? 16 : _context7.t0 === 422 ? 18 : 23;
            break;

          case 16:
            info = 'Данные не сохранены. Ответ сервера - 404. Не удалось найти запрашиваемую страницую.';
            return _context7.abrupt("break", 25);

          case 18:
            _context7.next = 20;
            return regeneratorRuntime.awrap(response.json());

          case 20:
            errors = _context7.sent;
            errors.errors.forEach(function (error) {
              if (info) {
                info = info + ' <br> ' + error.message;
              } else {
                info = error.message;
              }
            });
            return _context7.abrupt("break", 25);

          case 23:
            info = '"Что-то пошло не так..."';
            return _context7.abrupt("break", 25);

          case 25:
            ;

          case 26:
            ;
            wrapperError.classList.remove('blocked');
            spanError.innerHTML = info;

          case 29:
            ;

          case 30:
            ;

          case 31:
          case "end":
            return _context7.stop();
        }
      }
    });
  }

  ; // ========== Серверная часть
  // Задержка для тестов

  var delay = function delay(ms) {
    return new Promise(function (r) {
      return setTimeout(function () {
        return r();
      }, ms);
    });
  }; // Читаем клиентов из базы


  function fetchGetClients() {
    var response, data;
    return regeneratorRuntime.async(function fetchGetClients$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(delay(DELAY_TIME));

          case 2:
            _context8.next = 4;
            return regeneratorRuntime.awrap(fetch(URI));

          case 4:
            response = _context8.sent;
            _context8.next = 7;
            return regeneratorRuntime.awrap(response.json());

          case 7:
            data = _context8.sent;
            return _context8.abrupt("return", data);

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    });
  }

  ; // Ищем клиентов

  function fetchSearchClients(search) {
    var url, response, data;
    return regeneratorRuntime.async(function fetchSearchClients$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap(delay(DELAY_TIME));

          case 2:
            // установка задержки
            url = "".concat(URI, "?search=").concat(search);
            _context9.next = 5;
            return regeneratorRuntime.awrap(fetch(url));

          case 5:
            response = _context9.sent;
            _context9.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            data = _context9.sent;
            return _context9.abrupt("return", data);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    });
  }

  ; // Добавляем клиента в базу

  function fetchAddClient(obj) {
    var response;
    return regeneratorRuntime.async(function fetchAddClient$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return regeneratorRuntime.awrap(delay(DELAY_TIME));

          case 2:
            _context10.next = 4;
            return regeneratorRuntime.awrap(fetch(URI, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(obj)
            }));

          case 4:
            response = _context10.sent;
            return _context10.abrupt("return", response);

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    });
  }

  ; // Получаем клиента по его ID

  function fetchGetClientById(id) {
    var response, data;
    return regeneratorRuntime.async(function fetchGetClientById$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return regeneratorRuntime.awrap(delay(DELAY_TIME));

          case 2:
            _context11.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat(URI, "/").concat(id)));

          case 4:
            response = _context11.sent;
            _context11.next = 7;
            return regeneratorRuntime.awrap(response.json());

          case 7:
            data = _context11.sent;
            return _context11.abrupt("return", data);

          case 9:
          case "end":
            return _context11.stop();
        }
      }
    });
  }

  ; // Обновляем данные клиента по ID

  function fetchUpdateClient(obj, id) {
    var response;
    return regeneratorRuntime.async(function fetchUpdateClient$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return regeneratorRuntime.awrap(delay(DELAY_TIME));

          case 2:
            _context12.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat(URI, "/").concat(id), {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(obj)
            }));

          case 4:
            response = _context12.sent;
            return _context12.abrupt("return", response);

          case 6:
          case "end":
            return _context12.stop();
        }
      }
    });
  }

  ; // Удаляем клиента по ID. Ничего не возвращает в body

  function fetchDeleteClient(id) {
    var response;
    return regeneratorRuntime.async(function fetchDeleteClient$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return regeneratorRuntime.awrap(fetch("".concat(URI, "/").concat(id), {
              method: "DELETE"
            }));

          case 2:
            response = _context13.sent;
            return _context13.abrupt("return", response);

          case 4:
          case "end":
            return _context13.stop();
        }
      }
    });
  }

  ; // Добавление клиентов из базы данных в таблицу

  function updateClientsInTable() {
    var serchInput, tableBodyOverley;
    return regeneratorRuntime.async(function updateClientsInTable$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            // Заблокировал инпут поиска клиентов 
            serchInput = document.querySelector('.search-form__input');
            serchInput.disabled = true; // Показал оверлей

            tableBodyOverley = document.querySelector('.table-body__overlay');
            tableBodyOverley.classList.remove('blocked'); // Записал данные о клинетах из базы в массив объекта

            _context14.next = 6;
            return regeneratorRuntime.awrap(fetchGetClients());

          case 6:
            clientsState.clients = _context14.sent;
            // Вставил данные в таблицу
            insertClientsData(clientsState); // Скрыл оверлей

            tableBodyOverley.classList.add('blocked'); // Разблокировал инпут поиска клиентов

            serchInput.disabled = false;

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    });
  }

  ; // Создание списка найденных клиентов

  function createListItems(clients, list, tableBody) {
    clients.forEach(function (client) {
      var listItem = document.createElement('li');
      listItem.classList.add('search__items');
      listItem.setAttribute('data-id', client.id);
      listItem.textContent = client.name + ' ' + client.surname;
      list.append(listItem); // Клик по списку

      listItem.addEventListener('click', function () {
        showClientInTable(this.dataset.id, tableBody);
        clearListOfSearch(list);
      });
    });
    list.classList.remove('blocked');
    return list;
  }

  ; // Установка фокуса на элемент списка поиска клиентов

  function setFocusOnItem(focusedItem, itemElements) {
    if (focusedItem > itemElements.length - 1) {
      focusedItem = 0;
    }

    ;

    if (focusedItem < 0) {
      focusedItem = itemElements.length - 1;
    }

    ;
    unfocusAllItems(itemElements);
    itemElements[focusedItem].classList.add('search__items_focused');
    return focusedItem;
  }

  ; // Снятие фокусировок с элементов списка поиска клиентов

  function unfocusAllItems(itemElements) {
    itemElements.forEach(function (itemElement) {
      itemElement.classList.remove('search__items_focused');
    });
  }

  ; // Поиск клиента в таблице по id, подсвечивание и плавный скролл

  function showClientInTable(clientId) {
    // Подсветил клиента
    var trOfClient = document.getElementById(clientId);
    trOfClient.classList.add('outline_medium-slate-blue'); // Плавный скрол до найденного элемента

    trOfClient.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  ; // Очистка списка поиска 

  function clearListOfSearch(list) {
    list.classList.add('blocked');
    list.innerHTML = '';
  }

  ; // Основная функция

  document.addEventListener('DOMContentLoaded', function () {
    function createApp() {
      var container, header, tableHead, tableBody, addButton, listSearchedValues, timeoutId, listItemsElements, focusedItem, findContacts, clientId, client;
      return regeneratorRuntime.async(function createApp$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              findContacts = function _ref2() {
                var inputValue, serchedClients;
                return regeneratorRuntime.async(function findContacts$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        inputValue = header.input.value.trim();
                        clearListOfSearch(listSearchedValues);

                        if (!inputValue) {
                          _context15.next = 10;
                          break;
                        }

                        _context15.next = 5;
                        return regeneratorRuntime.awrap(fetchSearchClients(inputValue));

                      case 5:
                        serchedClients = _context15.sent;

                        if (serchedClients.length) {
                          listItemsElements = createListItems(serchedClients, listSearchedValues, tableBody.tableBody).querySelectorAll('.search__items');
                        } else {
                          listItemsElements = null;
                        }

                        ;
                        _context15.next = 11;
                        break;

                      case 10:
                        listItemsElements = null;

                      case 11:
                        ;

                      case 12:
                      case "end":
                        return _context15.stop();
                    }
                  }
                });
              };

              container = document.getElementById('crm-app');
              header = createHeader(); //Создаю шапку сайта с лого и поиском

              tableHead = createTableHead(); //Создаю шапку таблицы

              tableBody = createTableBody(); //Создаю тело таблицы для вставки данных о клиентах

              addButton = createAddClientButton(); //TODO кнопку встроить после получения данных о клиентах  Создаю кнопку "Добавить клиента"

              container.append(header.header); //Добавил шапку сайта в контейнер сайта

              container.append(tableHead.main); //Добавил шапку таблицы в контейнер сайта

              tableHead.tableBox.append(tableBody.tableBody); //Добавил в шапку таблицы тело таблицы

              tableHead.main.append(addButton.wrapper); //Добвил в секцию main кнопку "Довавить клиента"
              // Вставил данные из базы в таблицу

              _context16.next = 12;
              return regeneratorRuntime.awrap(updateClientsInTable());

            case 12:
              // Показываю тултипы
              showTooltips(); // Поиск по ФИО
              // Создаем список для вывода результатов поиска 

              listSearchedValues = document.createElement('ul');
              listSearchedValues.classList.add('search__list', 'blocked');
              header.form.append(listSearchedValues);
              timeoutId = null;
              listItemsElements = null;
              focusedItem = -1;
              header.input.addEventListener('input', function () {
                var highlightedItems = tableBody.tableBody.querySelectorAll('.table__row');
                highlightedItems.forEach(function (highlightedItem) {
                  highlightedItem.classList.remove('outline_medium-slate-blue');
                });
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                  findContacts();
                }, DELAY_TIME);
              }); // Ищу клиентов по введенным данным в input

              ; // Установливаем обработчик событий на keydown

              document.addEventListener('keydown', function (event) {
                if (listItemsElements) {
                  switch (event.key) {
                    case 'Enter':
                      event.preventDefault();
                      showClientInTable(listItemsElements[focusedItem].dataset.id);
                      clearListOfSearch(listSearchedValues);
                      break;

                    case 'ArrowDown':
                      focusedItem++;
                      focusedItem = setFocusOnItem(focusedItem, listItemsElements);
                      break;

                    case 'ArrowUp':
                      focusedItem--;
                      focusedItem = setFocusOnItem(focusedItem, listItemsElements);
                      break;

                    case 'Escape':
                      clearListOfSearch(listSearchedValues);
                      break;
                  }

                  ;
                }

                ;
              }); // Сортировка данных в таблице 

              sortDataInTable(clientsState, tableHead.tr); // Добавляем клиента

              addButton.button.addEventListener('click', function () {
                modalWindowStructure.type = 'new';
                createModalWindow('', modalWindowStructure);
              }); // Если location.hash ссылка, открываем модальное

              if (!document.location.hash) {
                _context16.next = 31;
                break;
              }

              clientId = document.location.hash.split('_')[1];
              modalWindowStructure.type = 'change';
              _context16.next = 29;
              return regeneratorRuntime.awrap(fetchGetClientById(clientId));

            case 29:
              client = _context16.sent;
              createModalWindow(client, modalWindowStructure);

            case 31:
              ;

            case 32:
            case "end":
              return _context16.stop();
          }
        }
      });
    }

    ;
    createApp();
  });
})();
//# sourceMappingURL=main.dev.js.map
