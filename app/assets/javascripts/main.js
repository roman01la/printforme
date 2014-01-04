(function (window, $) {

  // HOME
  ////////////////////
  if (!!document.querySelector('body.home')) {
    var search = document.querySelector('.search'),
        searchInput = search.firstElementChild,
        homeMain = document.querySelector('.home .main').style,
        _lat = {el: document.querySelector('.lat'), val: null},
        _lng = {el: document.querySelector('.lng'), val: null},
        autocomplete;

    onResize();

    autocomplete = new google.maps.places.Autocomplete(
      searchInput, {types: ['(regions)']}
    );

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();

      _lat.val = place.geometry.location.lat();
      _lng.val = place.geometry.location.lng();

      search.dispatchEvent(new Event('submit'));
    });
    search.addEventListener('submit', function (e) {
      e.preventDefault();

      if (_lat.val === null || _lng.val === null) {
        selectFirstResult(false);

        return;
      }

      _lat.el.value = _lat.val;
      _lng.el.value = _lng.val;

      this.submit();
    }, false);
    window.addEventListener('resize', onResize, false);
  }

  // SIGNUP
  ////////////////////
  if (!!document.querySelector('body.signup')) {
    var signupForm = document.querySelector('.signup-form'),
        signupBtn = document.querySelector('.signup-form .btn'),
        acceptCheck = document.querySelector('.signup-form .accept'),
        acceptSwitch = document.querySelector('.signup-form label'),
        inputs = document.querySelectorAll('.field'),
        accept = false,
        inputValidity;

    H5F.setup(signupForm);

    [].forEach.call(inputs, function (el) {
      el.addEventListener('input', function() {
        inputValidity = 0;

        [].forEach.call(inputs, function (elCheck) {
          if (!!elCheck.checkValidity(null, 'parent')) {
            inputValidity++;
          }
        });
        if (!!inputs[2].checkValidity() && !!inputs[3].checkValidity() && inputs[2].value == inputs[3].value) {
          inputValidity++;
        }
        if (inputs[2].value != inputs[3].value && inputs[3].value.length > 0) {
          inputs[3].parentNode.classList.add('error');
          inputs[3].parentNode.classList.remove('valid');
        }
        if (inputValidity == 5 && !!accept) {
          signupBtn.disabled = false;
          signupForm.classList.add('valid');
        } else {
          signupBtn.disabled = true;
          signupForm.classList.remove('valid');
        }
      }, false);
    });
    acceptSwitch.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        return;
      }
      if (!acceptCheck.checked) {
        acceptCheck.checked = true;
        accept = true;

        if (inputValidity == 5) {
          signupBtn.disabled = false;
          signupForm.classList.add('valid');
        }
      } else {
        acceptCheck.checked = false;
        accept = false;
        signupBtn.disabled = true;
        signupForm.classList.remove('valid');
      }
    }, false);
  }

  // SIGNIN
  ////////////////////
  if (!!document.querySelector('body.signin')) {
    var signinForm = document.querySelector('.signin-form'),
        signinBtn = signinForm.querySelector('.btn'),
        rememberCheck = signinForm.querySelector('.remember'),
        rememberSwitch = signinForm.querySelector('label'),
        hiddenCheck = rememberCheck.previousElementSibling,
        inputs = signinForm.querySelectorAll('.field');

    [].forEach.call(inputs, function (el) {
      el.addEventListener('input', function() {
        if (inputs[0].value.length > 0 && inputs[1].value.length > 0) {
          signinBtn.disabled = false;
          signinForm.classList.add('valid');
        } else {
          signinBtn.disabled = true;
          signinForm.classList.remove('valid');
        }
      }, false);
    });
    rememberSwitch.addEventListener('click', function() {
      if (!rememberCheck.checked) {
        rememberCheck.checked = true;
        hiddenCheck.value = 1;
      } else {
        rememberCheck.checked = false;
        hiddenCheck.value = 0;
      }
    }, false);
  }

  // EDIT PROFILE
  ////////////////////
  if (!!document.querySelector('body.profile-edit')) {
    var infoForm = document.querySelector('.info-form'),
        saveBtn = infoForm.querySelector('.btn'),
        city = infoForm.querySelector('.city'),
        inputs = infoForm.querySelectorAll('.field'),
        _lat = {el: infoForm.querySelector('.lat'), val: null},
        _lng = {el: infoForm.querySelector('.lng'), val: null},
        placeValidity = false,
        autocomplete;

    autocomplete = new google.maps.places.Autocomplete(
      city, {types: ['(regions)']}
    );

    H5F.setup(infoForm);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();

      _lat.val = place.geometry.location.lat();
      _lng.val = place.geometry.location.lng();

      _lat.el.value = _lat.val;
      _lng.el.value = _lng.val;

      placeValidity = true;

      if (inputs[0].checkValidity() && inputs[1].checkValidity()) {
        saveBtn.disabled = false;
        infoForm.classList.add('valid');
      }
    });
    [].forEach.call(inputs, function (el) {
      el.addEventListener('input', function() {
        if (inputs[0].checkValidity() && inputs[1].checkValidity() && placeValidity && this.value.length !== 0) {
          saveBtn.disabled = false;
          infoForm.classList.add('valid');
        } else {
          if (this.classList.contains('city') && this.value.length === 0) {
            placeValidity = false;
          }
          saveBtn.disabled = true;
          infoForm.classList.remove('valid');
        }
      }, false);
    });
  }

  // ADD PRINTER
  ////////////////////
  if (!!document.querySelector('body.add-printer')) {
    var printerForm = document.querySelector('.printer-form'),
        price = printerForm.querySelector('.slider-range-wrapper').previousElementSibling.querySelector('span'),
        addBtn = printerForm.querySelectorAll('.btn')[0],
        saveBtn = printerForm.querySelectorAll('.btn')[1],
        table = printerForm.querySelector('.table'),
        tbody = table.querySelector('tbody'),
        priceF = printerForm.querySelector('.price-field'),
        modelF = printerForm.querySelector('.model-field'),
        resF = printerForm.querySelector('.res-field'),
        matF = printerForm.querySelector('.mat-field'),
        colorsF = printerForm.querySelector('.colors-field'),
        selects = printerForm.querySelectorAll('select'),
        inputDims = printerForm.querySelectorAll('.field.number'),
        materials = ['PLA пластик', 'Латунь', 'Нейлон', 'Керамика', 'Бронза', 'Нержавеющая сталь', 'ABS пластик', 'Песчаник', 'Алюминий', 'Дерево', 'Смола', 'Поликарбонат', 'Медицинский пластик', 'Бумага', 'Гибкий пластик'],
        colors = ['белый', 'черный', 'серебрянный', 'прозрачный', 'красный', 'бежевый', 'зеленый', 'фиолетовый', 'коричневый', 'розовый', 'желтый', 'оранжевый'],
        selectedColorsNum = [],
        dimsValidity = false,
        rangeTest;

    for (var i = 0, length = materials.length; i < length; i++) {
      selects[0].innerHTML += '<option value="' + i + '">' + materials[i] + '</option>';
    }
    for (var i = 0, length = colors.length; i < length; i++) {
      selects[1].innerHTML += '<option value="' + i + '">' + colors[i] + '</option>';
    }

    H5F.setup(printerForm);

    $('.chosen-select').chosen();

    rangeTest = document.createElement('input');
    rangeTest.type = 'range';

    if (rangeTest.type == 'text') {
      document.querySelector('.slider-range-wrapper').classList.remove('hidden');
      document.querySelector('.range-field').classList.add('hidden');
      $('.slider-range-min').slider({
        range: 'min',
        value: 25,
        min: 25,
        max: 300,
        step: 25,
        slide: function (e, ui) {
          var value = ui.value;

          price.textContent = value / 100;
          priceF.value = value;
        }
      });
    }

    modelF.addEventListener('input', function() {
      if (!this.checkValidity()) {
        this.parentNode.classList.add('error');
      }

      checkFormValidity();
    }, false);
    [].forEach.call(inputDims, function (el) {
      el.addEventListener('input', function() {
        var parentClass = this.parentNode.parentNode.classList;

        dimsValidity = 0;

        [].forEach.call(inputDims, function (elCheck) {
          if (elCheck.checkValidity()) {
            dimsValidity++;
          }
        });
        if (dimsValidity == inputDims.length) {
          parentClass.remove('error');
        } else {
          parentClass.add('error');
        }

        checkFormValidity();
      }, false);
    });
    resF.addEventListener('input', function() {
      this.checkValidity();
      checkFormValidity();
    }, false);
    matF.onchange = function() {
      this.checkValidity();
      checkFormValidity();
    };
    colorsF.onchange = function() {
      var parentClass = this.parentNode.classList;

      if (this.checkValidity()) {
        parentClass.remove('error');
        selectedColorsNum = [];
        [].forEach.call(this.querySelectorAll('option'), function (el) {
          if (el.selected) {
            selectedColorsNum.push(el.value);
          }
        });
      } else {
        parentClass.add('error');
      }
      checkFormValidity();
    };
    addBtn.addEventListener('click', function() {
      if (matF.checkValidity() && colorsF.checkValidity()) {
        var matId = matF.value,
            material = materials[matId],
            price = priceF.value || 25,
            selectedColors = [],
            tr = [];

        for (var i = 0, ln = selectedColorsNum.length; i < ln; i++) {
          selectedColors.push(colors[selectedColorsNum[i]]);
        }

        selectedColors = selectedColors.join(', ');
        price = price / 100;

        tr = [
          '<tr><td class="remove"><span>+</span></td><td data-id="' + matId + '">',
          material,
          '</td><td class="align" data-value="' + price * 100 + '">$',
          price,
          ' / куб. см</td><td data-ids="' + selectedColorsNum.join(', ') + '">',
          selectedColors,
          '</td></tr>'
        ].join('');

        tbody.innerHTML += tr;

        table.classList.remove('hidden');

        checkFormValidity();
      }
    }, false);
    document.addEventListener('click', function (e) {
      var items = printerForm.querySelectorAll('.table .remove'),
          removeBtn = e.target.parentNode;

      if (items.length > 0 && removeBtn.classList.contains('remove')) {
        tbody.removeChild(removeBtn.parentNode);
      }
      if (tbody.childElementCount === 0) {
        table.classList.add('hidden');
      }

      checkFormValidity();
    }, false);

    function checkFormValidity() {
      var formClass = printerForm.classList,
          formValidity;

      if (dimsValidity == inputDims.length) {
        dimsValidity = true;
      } else if (dimsValidity !== true) {
        dimsValidity = false;
      }

      formValidity = modelF.checkValidity() && dimsValidity && resF.checkValidity() && tbody.childElementCount > 0;

      if (matF.checkValidity() && colorsF.checkValidity()) {
        addBtn.disabled = false;
        formClass.add('mvalid');
      } else {
        addBtn.disabled = true;
        formClass.remove('mvalid');
      }
      if (formValidity) {
        saveBtn.disabled = false;
        formClass.add('pvalid');
      } else {
        saveBtn.disabled = true;
        formClass.remove('pvalid');
      }
    }
    printerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var matsList = tbody.querySelectorAll('tr'),
          model = modelF.value,
          dims = [],
          res = parseFloat(resF.value),
          materials = [],
          data = {};

      [].forEach.call(inputDims, function (el) {
        dims.push(parseInt(el.value, 10));
      });
      [].forEach.call(matsList, function (el) {
        var matItems = el.querySelectorAll('td'),
            matId, matPrice, matColorsIds;

        matId = parseInt(matItems[1].getAttribute('data-id'), 10);
        matPrice = parseFloat(matItems[2].getAttribute('data-value'));
        matColorsIds = matItems[3].getAttribute('data-ids').split(', ');

        for (var j = 0, jlength = matColorsIds.length; j < jlength; j++) {
          matColorsIds[j] = parseInt(matColorsIds[j], 10);
        }

        materials.push({
          id: matId,
          price: matPrice,
          colors: matColorsIds
        });
      });

      data = {
        printer: {
          model: model,
          dims: dims,
          res: res
        },
        materials: materials
      };
    }, false);
  }

  function selectFirstResult (provided) {
    var geocoder = new google.maps.Geocoder(),
        pacCont = document.querySelector('.pac-container'),
        firstResult;

    pacCont.style.display = 'none';

    if (!provided) {
      firstResult = pacCont.querySelectorAll('.pac-item')[0].textContent;
    } else {
      firstResult = searchInput.value;
    }

    geocoder.geocode({"address": firstResult }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        _lat.val = results[0].geometry.location.lat();
        _lng.val = results[0].geometry.location.lng();

        searchInput.value = firstResult;

        if (!provided) {
          search.dispatchEvent(new Event('submit'));
        }
      }
    });
  }

  function onResize() {
    var width = window.innerWidth;

    if (width >= 1050 && width <= 1920) {
      homeMain.backgroundPositionX = (width - 1920) / 2 + 'px';
    }
    if (width < 1050) {
      homeMain.backgroundPositionX = - 435 + 'px';
    }
  }
})(window, jQuery);
