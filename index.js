var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var containerAllComments = document.querySelector(".container_all_comments");
// Задаются листы с кнопками и блок sortingList для измегнений на странице
var conditions = document.querySelectorAll(".condition");
var buttons = document.querySelectorAll(".btn");
var sortingList = document.querySelector(".container_sortng_list");
// Функция, которая проверяет нажатия на кнопки и выдаёт класссы активного нажатия
function buttonSelection(changeList, changeClass) {
    changeList.forEach(function (item) {
        item.addEventListener("click", function () {
            if (item == buttons[1] && buttons[1].classList.contains('btn_active')) { // Проверяет повторное нажатие на кнопку сортировки (Её нажимают и она уже активна)
                item.classList.contains("sorting_up") ? item.classList.remove("sorting_up") : item.classList.add("sorting_up"); // Удаляет или добавляет класс sorting_up
            }
            changeList.forEach(function (inactiveitem) {
                inactiveitem.classList.remove(changeClass);
            });
            item.classList.add(changeClass); // Выбирает новый
            if (changeClass === "selected_considion") { // Если изменяется элемент в sortingList (conditions), также меняется и состояние кнопки сортировки
                buttons[1].textContent = item.textContent;
            }
            if (buttons[1].classList.contains('btn_active')) { // Ищет кнопку сортировки (При нажатии появляется sortingList и исчезает в противном случае)
                sortingList.classList.remove("container_sortng_list_active");
            }
            else {
                sortingList.classList.add("container_sortng_list_active");
            }
        });
    });
}
buttons[0].addEventListener("click", function () {
    var information = JSON.parse(localStorage.getItem("Comments")); // Информация из localStorage в виде {id: Object, ...}
    var arr = createArr(information)[0]; // Обновляем arr до последнего значения
    containerAllComments.innerHTML = "";
    render(arr);
});
buttons[2].addEventListener("click", function () {
    // Нажатие на кнопку Избранное
    var information = JSON.parse(localStorage.getItem("Comments")); // Информация из localStorage в виде {id: Object, ...}
    var arr = createArr(information)[0]; // Обновляем arr до последнего значения
    var newArr = {};
    for (var key in arr) {
        newArr[key] = arr[key].filter(function (elem) {
            return elem.favourites;
        });
    }
    containerAllComments.innerHTML = "";
    render(newArr);
});
conditions[0].addEventListener("click", function () {
    var information = JSON.parse(localStorage.getItem("Comments")); // Информация из localStorage в виде {id: Object, ...}
    var arr = createArr(information)[0]; // Обновляем arr до последнего значения
    containerAllComments.innerHTML = "";
    render(arr);
});
conditions[1].addEventListener("click", function () {
    var information = JSON.parse(localStorage.getItem("Comments")); // Информация из localStorage в виде {id: Object, ...}
    var arr = createArr(information)[0]; // Обновляем arr до последнего значения
    containerAllComments.innerHTML = "";
    render(arr);
});
buttonSelection(conditions, "selected_considion");
buttonSelection(buttons, "btn_active");
function createArr(information) {
    var arr = {};
    var informationWithObjects = {};
    for (var key in information) { // Распложение ID комментариев в правильном порядке ID: [ID дочернего, ...] ...
        var item = information[key]; // В данном месте key ни к чему не относится (Служит для возможности заноса в localStorage)
        if (item.parentID !== undefined) {
            arr[item.parentID].push(new ChildComment([item.id, item.author, item.date, item.context, item.rating, item.favourites, item.parentID, item.answerToAuthor])); // Добавление в массив дочернего экземпляра
            informationWithObjects[item.id] = arr[item.parentID][(arr[item.parentID]).length - 1];
        }
        else {
            arr[item.id] = [new AnyComment([item.id, item.author, item.date, item.context, item.rating, item.favourites])]; // Добавление в массив Родительского экземпляра
            informationWithObjects[item.id] = arr[item.id][0];
        }
    }
    return [arr, informationWithObjects];
}
function saveAllChanges(information) {
    localStorage.setItem("Comments", JSON.stringify(information));
    containerAllComments.innerHTML = "";
    render(createArr(information)[0]);
}
var answ = document.getElementById("answer_information"); // Поле с информацией, на какой комментарий отвечаем
function addButtonEvent() {
    var buttonAnswer = document.querySelectorAll(".btn_answer");
    var buttonFavor = document.querySelectorAll(".btn_favourites");
    var buttonRatingPlus = document.querySelectorAll(".btn_plus");
    var buttonRatingMinus = document.querySelectorAll(".btn_minus");
    buttonAnswer.forEach(function (item) {
        item.addEventListener("click", function () {
            var id = item.getAttribute("--data-id");
            input.setAttribute("data-answer", informationWithObjects[id].author);
            input.setAttribute("data-parentID", id);
            answ.textContent = "Ответить на сообщение от " + informationWithObjects[id].author;
            answ.classList.add("activeAns");
            answ.scrollIntoView({ behavior: 'smooth' });
        });
    });
    buttonFavor.forEach(function (item) {
        item.addEventListener("click", function () {
            var id = item.getAttribute("--data-id");
            informationWithObjects[id].changeFavour();
            saveAllChanges(informationWithObjects);
        });
    });
    buttonRatingPlus.forEach(function (item) {
        item.addEventListener("click", function () {
            var id = item.getAttribute("--data-id");
            informationWithObjects[id].ratingPlus();
            saveAllChanges(informationWithObjects);
        });
    });
    buttonRatingMinus.forEach(function (item) {
        item.addEventListener("click", function () {
            var id = item.getAttribute("--data-id");
            informationWithObjects[id].ratingMinus();
            saveAllChanges(informationWithObjects);
        });
    });
}
// Задаются все эдементы для блока с вводом комментария
var countOfWord = document.querySelector(".input_count_of_word");
var input = document.querySelector(".container_textarea");
var sendButton = document.getElementById("send_button");
input.addEventListener("input", function () {
    var _a, _b, _c, _d;
    if (((_a = input.textContent) === null || _a === void 0 ? void 0 : _a.length) == 0) { // Ничего не написано - кнопка заблокирована, стандартный текст
        countOfWord.textContent = "Макс. 1000 символов";
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.removeAttribute("enabled");
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.setAttribute("disabled", "");
        countOfWord === null || countOfWord === void 0 ? void 0 : countOfWord.classList.remove("limit_error");
    }
    else if (((_b = input.textContent) === null || _b === void 0 ? void 0 : _b.length) > 1000) { // Больше, чем 1000 - кнопка заблокирована, выводится количество символов + предупреждение
        countOfWord.textContent = ((_c = input.textContent) === null || _c === void 0 ? void 0 : _c.length) + "/1000";
        countOfWord === null || countOfWord === void 0 ? void 0 : countOfWord.classList.add("limit_error");
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.removeAttribute("enabled");
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.setAttribute("disabled", "");
    }
    else { // Меньше 1000 - кнопка открыта, выводится количество символов
        countOfWord.textContent = ((_d = input.textContent) === null || _d === void 0 ? void 0 : _d.length) + "/1000";
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.removeAttribute("disabled");
        sendButton === null || sendButton === void 0 ? void 0 : sendButton.setAttribute("enabled", "");
        countOfWord === null || countOfWord === void 0 ? void 0 : countOfWord.classList.remove("limit_error");
    }
});
var AnyComment = /** @class */ (function () {
    function AnyComment(_a) {
        var id = _a[0], author = _a[1], date = _a[2], context = _a[3], rating = _a[4], favourites = _a[5];
        this.id = id;
        this.author = author;
        this.date = date;
        this.context = context;
        this.rating = rating;
        this.favourites = favourites;
    }
    AnyComment.prototype.giveString = function () {
        return JSON.stringify({
            "id": this.id,
            "author": this.author,
            "date": this.date,
            "context": this.context,
            "rating": this.rating,
            "favourites": this.favourites
        });
    };
    AnyComment.prototype.changeFavour = function () {
        this.favourites = !this.favourites;
    };
    AnyComment.prototype.ratingPlus = function () {
        this.rating++;
    };
    AnyComment.prototype.ratingMinus = function () {
        this.rating--;
    };
    return AnyComment;
}());
var ChildComment = /** @class */ (function (_super) {
    __extends(ChildComment, _super);
    function ChildComment(_a) {
        var id = _a[0], author = _a[1], date = _a[2], context = _a[3], rating = _a[4], favourites = _a[5], parentID = _a[6], answerToAuthor = _a[7];
        var _this = _super.call(this, [id, author, date, context, rating, favourites]) || this;
        _this.id = id;
        _this.author = author;
        _this.date = date;
        _this.context = context;
        _this.rating = rating;
        _this.favourites = favourites;
        _this.parentID = parentID;
        _this.answerToAuthor = answerToAuthor;
        return _this;
    }
    ChildComment.prototype.giveString = function () {
        return JSON.stringify({
            "id": this.id,
            "author": this.author,
            "date": this.date,
            "context": this.context,
            "rating": this.rating,
            "favourites": this.favourites,
            "parentID": this.parentID,
            "answerToAuthor": this.answerToAuthor
        });
    };
    return ChildComment;
}(AnyComment));
var text1 = "Самое обидное когда сценарий по сути есть - в виде книг, где нет сюжетных дыр, всё логично, стройное повествование и достаточно взять и экранизировать оригинал как это было в первых фильмах с минимальным количеством отсебятины и зритель с восторгом примет любой такой фильм и сериал, однако вместо этого 'Кольца власти' просто позаимствовали имена из оригинала, куски истории, мало связанные между собой и выдали очередной среднячковый сериал на один раз в лучшем случае.";
// Проверке тестовых комментариев в разном порядке
// let comm1 = new AnyComment([0, "author", "30.08 15:30", text1, 0, false])
// let comm2 = new AnyComment([1, "sdfds", "30.08 15:40", "y", 0, false])
// let comm3 = new ChildComment([2, "Not an author", "31.08 12:10", "XXX", 0, false, 0, "Mish"])
// let comm4 = new ChildComment([3, "Next", "1.09 13:20", "YYY", 0, false, 0, "Mish"])
// const CommentsArray = {0: comm1, 1: comm2, 2: comm3, 3: comm4}
// saveAllChanges(CommentsArray)
function render(arr) {
    var _loop_1 = function (key) {
        var parentArr = arr[key]; // Массивы со связью [Родитель, Дочерний, Дочерний...]
        parentArr.forEach(function (item) {
            var addFavor = "";
            if (item.favourites) {
                addFavor = "favour";
            }
            if (item.id == key) { // Задаём родителя
                containerAllComments.innerHTML += "\n                <div class=\"comment\">\n                    <span class=\"input_name\">".concat(item.author, "</span><span class=\"comment_data\">").concat(item.date, "</span>\n                    <p class=\"comment_text\">").concat(item.context, "</p>\n                    <div class=\"comment_btn\">\n                        <button --data-id=\"").concat(item.id, "\" class=\"btn_answer\">\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C</button>\n                        <button --data-id=\"").concat(item.id, "\" class=\"btn_favourites ").concat(addFavor, "\">\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u043C</button>\n                        <div class=\"rating_system\">\n                            <button --data-id=\"").concat(item.id, "\" class=\"btn_minus\">-</button>\n                            <p id=\"rating_info\" --data-rating-").concat(item.rating > 0, ">").concat(item.rating, "</p>\n                            <button --data-id=\"").concat(item.id, "\" class=\"btn_plus\">+</button>\n                        </div>\n                    </div>\n                </div>\n                ");
            }
            else { // Задаём дочерние комментарии
                containerAllComments.innerHTML += "\n                <div class=\"answer_comment\">\n                    <span class=\"input_name\">".concat(item.author, "</span><span class=\"comment_data\">").concat(item.date, "</span>\n                    <p class=\"comment_text\">").concat(item.context, "</p>\n                    <div class=\"comment_btn\">\n                        <button --data-id=\"").concat(item.id, "\" class=\"btn_favourites ").concat(addFavor, "\">\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u043C</button>\n                        <div class=\"rating_system\">\n                            <button --data-id=\"").concat(item.id, "\" class=\"btn_minus\">-</button>\n                            <p id=\"rating_info\" --data-rating-").concat(item.rating > 0, ">").concat(item.rating, "</p>\n                            <button --data-id=\"").concat(item.id, "\" class=\"btn_plus\">+</button>\n                        </div>\n                    </div>\n                </div>\n                ");
            }
        });
    };
    for (var key in arr) {
        _loop_1(key);
    }
    addButtonEvent();
}
var information = JSON.parse(localStorage.getItem("Comments")); // Информация из localStorage в виде {id: Object, ...}
var arr = createArr(information)[0];
var informationWithObjects = createArr(information)[1]; // Такая же информация, но с объектами
render(arr);
var keys = Object.keys(information); // Все ключи из localStorage
var btnComments = document.getElementById("comments");
btnComments.innerHTML = "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 (".concat(keys.length, ")"); // Обновление счётчика новых комментариев
if (keys.length == 0) { // Если в LocalStorage нет ключей
    keys = ["-1"];
}
sendButton.addEventListener("click", function () {
    var information = JSON.parse(localStorage.getItem("Comments")); // Актуальная информация
    var arr = createArr(information)[0];
    var date = new Date();
    var newComment = { id: 0 };
    if (input.getAttribute("data-answer") === " ") {
        newComment = new AnyComment([+keys[keys.length - 1] + 1, "User #id141", "".concat(date.toLocaleDateString().slice(0, 5), " ").concat(date.toLocaleTimeString().slice(0, 5)), input.textContent, 0, false]);
    }
    else {
        newComment = new ChildComment([+keys[keys.length - 1] + 1, "User #id141", "".concat(date.toLocaleDateString().slice(0, 5), " ").concat(date.toLocaleTimeString().slice(0, 5)), input.textContent, 0, false, +input.getAttribute("data-parentID"), input.getAttribute("data-answer")]);
    }
    information[newComment.id] = newComment;
    saveAllChanges(information);
});
