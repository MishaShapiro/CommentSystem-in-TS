const containerAllComments: HTMLElement = <HTMLElement>document.querySelector(".container_all_comments")

// Задаются листы с кнопками и блок sortingList для измегнений на странице

const conditions: NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".condition")
const buttons: NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".btn")
const sortingList: HTMLElement = <HTMLElement>document.querySelector(".container_sortng_list")

// Функция, которая проверяет нажатия на кнопки и выдаёт класссы активного нажатия

function buttonSelection (changeList: NodeListOf<Element>, changeClass: string): void {
    changeList.forEach((item): void => {
        item.addEventListener("click", (): void => {
            if (item == buttons[1] && buttons[1].classList.contains('btn_active')) { // Проверяет повторное нажатие на кнопку сортировки (Её нажимают и она уже активна)
                item.classList.contains("sorting_up") ? item.classList.remove("sorting_up") : item.classList.add("sorting_up") // Удаляет или добавляет класс sorting_up
            }
            changeList.forEach((inactiveitem): void => { // Удаляет все активнеые
                inactiveitem.classList.remove(changeClass)
            })
            item.classList.add(changeClass) // Выбирает новый

            if (changeClass === "selected_considion") { // Если изменяется элемент в sortingList (conditions), также меняется и состояние кнопки сортировки
                buttons[1].textContent = item.textContent
            }
            
            if (buttons[1].classList.contains('btn_active')) { // Ищет кнопку сортировки (При нажатии появляется sortingList и исчезает в противном случае)
                sortingList.classList.remove("container_sortng_list_active")
            } else {
                sortingList.classList.add("container_sortng_list_active")
            }
        })
    })
}

buttons[0].addEventListener("click", () => { // В данном случае localStorage хранит последнюю информацию (Самую актуальную), поэтомумы берём из него всё, что нам нужно 
    const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Информация из localStorage в виде {id: Object, ...}
    const arr = createArr(information)[0] // Обновляем arr до последнего значения
    containerAllComments.innerHTML = ""
    render(arr)
})

buttons[2].addEventListener("click", () => {
     // Нажатие на кнопку Избранное
    const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Информация из localStorage в виде {id: Object, ...}
    const arr = createArr(information)[0] // Обновляем arr до последнего значения
    const newArr = {}
    for (let key in arr) {
        newArr[key] = arr[key].filter((elem): object => {
            return elem.favourites
        })
    }
    containerAllComments.innerHTML = ""
    render(newArr)
})

conditions[0].addEventListener("click", () => {
    const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Информация из localStorage в виде {id: Object, ...}
    const arr = createArr(information)[0] // Обновляем arr до последнего значения
    containerAllComments.innerHTML = ""
    render(arr)
})

conditions[1].addEventListener("click", () => {
    const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Информация из localStorage в виде {id: Object, ...}
    const arr = createArr(information)[0] // Обновляем arr до последнего значения
    containerAllComments.innerHTML = ""
    render(arr)
})


buttonSelection(conditions, "selected_considion")
buttonSelection(buttons, "btn_active")

function createArr(information) {
    const arr = {}
    const informationWithObjects = {}
    for (let key in information) { // Распложение ID комментариев в правильном порядке ID: [ID дочернего, ...] ...
        let item = information[key] // В данном месте key ни к чему не относится (Служит для возможности заноса в localStorage)
        if (item.parentID !== undefined) {
            arr[item.parentID].push(new ChildComment([item.id, item.author, item.date, item.context, item.rating, item.favourites, item.parentID, item.answerToAuthor])) // Добавление в массив дочернего экземпляра
            informationWithObjects[item.id] = arr[item.parentID][(arr[item.parentID]).length - 1]
        } else {
            arr[item.id] = [new AnyComment([item.id, item.author, item.date, item.context, item.rating, item.favourites])] // Добавление в массив Родительского экземпляра
            informationWithObjects[item.id] = arr[item.id][0]
        }
    }
    return [arr, informationWithObjects]
}

function saveAllChanges(information) {
    localStorage.setItem("Comments", JSON.stringify(information))
    containerAllComments.innerHTML = ""
    render(createArr(information)[0])
}

const answ: HTMLElement = <HTMLElement>document.getElementById("answer_information") // Поле с информацией, на какой комментарий отвечаем

function addButtonEvent() { // Добавляет функционал для кнопок Ответить и Избранное
    const buttonAnswer : NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".btn_answer")
    const buttonFavor : NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".btn_favourites")
    const buttonRatingPlus : NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".btn_plus")
    const buttonRatingMinus : NodeListOf<Element> = <NodeListOf<Element>>document.querySelectorAll(".btn_minus")

    buttonAnswer.forEach((item): void => {
        item.addEventListener("click", (): void => {
            let id : string = <string>item.getAttribute("--data-id")
            input.setAttribute("data-answer", informationWithObjects[id].author)
            input.setAttribute("data-parentID", id)
            answ.textContent = "Ответить на сообщение от " + informationWithObjects[id].author
            answ.classList.add("activeAns")
            answ.scrollIntoView({behavior: 'smooth'})
        })
    }) 

    buttonFavor.forEach((item): void => {
        item.addEventListener("click", (): void => {
            let id : string = <string>item.getAttribute("--data-id")
            informationWithObjects[id].changeFavour()
            saveAllChanges(informationWithObjects)
        })
    })

    buttonRatingPlus.forEach((item): void => {
        item.addEventListener("click", (): void => {
            let id : string = <string>item.getAttribute("--data-id")
            informationWithObjects[id].ratingPlus()
            saveAllChanges(informationWithObjects)
        })
    })

    buttonRatingMinus.forEach((item): void => {
        item.addEventListener("click", (): void => {
            let id : string = <string>item.getAttribute("--data-id")
            informationWithObjects[id].ratingMinus()
            saveAllChanges(informationWithObjects)
        })
    })
}

// Задаются все эдементы для блока с вводом комментария

const countOfWord: HTMLElement = <HTMLElement>document.querySelector(".input_count_of_word")
const input: HTMLElement = <HTMLElement>document.querySelector(".container_textarea")
const sendButton: HTMLElement = <HTMLElement>document.getElementById("send_button")

input.addEventListener("input", (): void => { // Если какой-то текст набирается в input, изменяется состояние кнопки кол-ва символов
    if (input.textContent?.length == 0) { // Ничего не написано - кнопка заблокирована, стандартный текст
        countOfWord.textContent = "Макс. 1000 символов"
        sendButton?.removeAttribute("enabled")
        sendButton?.setAttribute("disabled", "")
        countOfWord?.classList.remove("limit_error")
    } else if (input.textContent?.length > 1000) { // Больше, чем 1000 - кнопка заблокирована, выводится количество символов + предупреждение
        countOfWord.textContent = input.textContent?.length + "/1000"
        countOfWord?.classList.add("limit_error")
        sendButton?.removeAttribute("enabled")
        sendButton?.setAttribute("disabled", "")
    }
    else { // Меньше 1000 - кнопка открыта, выводится количество символов
        countOfWord.textContent = input.textContent?.length + "/1000"
        sendButton?.removeAttribute("disabled")
        sendButton?.setAttribute("enabled", "")
        countOfWord?.classList.remove("limit_error")
    }
})

type CommentType = [number, string, string, string, number, boolean, number?, string?] // Патерн типов для классов

class AnyComment { // Класс комментариев
    id: number;
    author: string;
    date: string;
    context: string;
    rating: number;
    favourites: boolean

    constructor([id, author, date, context, rating, favourites]: CommentType) {
        this.id = id;
        this.author = author;
        this.date = date;
        this.context = context;
        this.rating = rating;
        this.favourites = favourites;
    }

    giveString(): string { // Метод для преобразование экземпляра в объект
        return JSON.stringify({
            "id": this.id,
            "author": this.author,
            "date": this.date,
            "context": this.context,
            "rating": this.rating,
            "favourites": this.favourites
        })
    }

    changeFavour(): void {
        this.favourites = !this.favourites
    }

    ratingPlus(): void {
        this.rating++
    }

    ratingMinus(): void {
        this.rating--
    }
}

class ChildComment extends AnyComment { // Дочерний класс комментариев
    parentID: number;
    answerToAuthor: string;

    constructor([id, author, date, context, rating, favourites, parentID, answerToAuthor]: CommentType) {
        super([id, author, date, context, rating, favourites])
        this.id = id;
        this.author = author;
        this.date = date;
        this.context = context;
        this.rating = rating;
        this.favourites = favourites;
        this.parentID = <number>parentID;
        this.answerToAuthor = <string>answerToAuthor;
    }

    giveString(): string {
        return JSON.stringify({
            "id": this.id,
            "author": this.author,
            "date": this.date,
            "context": this.context,
            "rating": this.rating,
            "favourites": this.favourites,
            "parentID": this.parentID,
            "answerToAuthor": this.answerToAuthor
        })
    }
}

let text1: string = "Самое обидное когда сценарий по сути есть - в виде книг, где нет сюжетных дыр, всё логично, стройное повествование и достаточно взять и экранизировать оригинал как это было в первых фильмах с минимальным количеством отсебятины и зритель с восторгом примет любой такой фильм и сериал, однако вместо этого 'Кольца власти' просто позаимствовали имена из оригинала, куски истории, мало связанные между собой и выдали очередной среднячковый сериал на один раз в лучшем случае."

// Проверке тестовых комментариев в разном порядке
// let comm1 = new AnyComment([0, "author", "30.08 15:30", text1, 0, false])
// let comm2 = new AnyComment([1, "sdfds", "30.08 15:40", "y", 0, false])
// let comm3 = new ChildComment([2, "Not an author", "31.08 12:10", "XXX", 0, false, 0, "Mish"])
// let comm4 = new ChildComment([3, "Next", "1.09 13:20", "YYY", 0, false, 0, "Mish"])

// const CommentsArray = {0: comm1, 1: comm2, 2: comm3, 3: comm4}

// saveAllChanges(CommentsArray)

function render(arr) { // Функция вывода комментариев на страницу
    for (let key in arr) { // key - ID Родителя - первого элемента
        let parentArr = arr[key] // Массивы со связью [Родитель, Дочерний, Дочерний...]
        parentArr.forEach((item): void => {
            let addFavor : string = ""
            if (item.favourites) {
                addFavor = "favour"
            }

            if (item.id == key) { // Задаём родителя
                containerAllComments.innerHTML += `
                <div class="comment">
                    <span class="input_name">${item.author}</span><span class="comment_data">${item.date}</span>
                    <p class="comment_text">${item.context}</p>
                    <div class="comment_btn">
                        <button --data-id="${item.id}" class="btn_answer">Ответить</button>
                        <button --data-id="${item.id}" class="btn_favourites ${addFavor}">В избранном</button>
                        <div class="rating_system">
                            <button --data-id="${item.id}" class="btn_minus">-</button>
                            <p id="rating_info" --data-rating-${item.rating > 0}>${item.rating}</p>
                            <button --data-id="${item.id}" class="btn_plus">+</button>
                        </div>
                    </div>
                </div>
                `   
            } else { // Задаём дочерние комментарии
                containerAllComments.innerHTML += `
                <div class="answer_comment">
                    <span class="input_name">${item.author}</span><span class="comment_data">${item.date}</span>
                    <p class="comment_text">${item.context}</p>
                    <div class="comment_btn">
                        <button --data-id="${item.id}" class="btn_favourites ${addFavor}">В избранном</button>
                        <div class="rating_system">
                            <button --data-id="${item.id}" class="btn_minus">-</button>
                            <p id="rating_info" --data-rating-${item.rating > 0}>${item.rating}</p>
                            <button --data-id="${item.id}" class="btn_plus">+</button>
                        </div>
                    </div>
                </div>
                `
            }
        })
    }
    addButtonEvent()
}

const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Информация из localStorage в виде {id: Object, ...}

const arr: any = createArr(information)[0]
const informationWithObjects: any = createArr(information)[1] // Такая же информация, но с объектами

render(arr)


let keys = Object.keys(information) // Все ключи из localStorage
const btnComments : HTMLElement = <HTMLElement>document.getElementById("comments")
btnComments.innerHTML = `Комментарии (${keys.length})` // Обновление счётчика новых комментариев

if (keys.length == 0) { // Если в LocalStorage нет ключей
    keys = ["-1"]
}

sendButton.addEventListener("click", () => { // При нажатии на кнопку, добавляется новый комментарий в localStorage
    const information: any = JSON.parse(<string>localStorage.getItem("Comments")) // Актуальная информация
    const arr: any = createArr(information)[0]

    let date = new Date()
    let newComment = {id: 0}
    if (input.getAttribute("data-answer") === " ") {
        newComment = new AnyComment([+keys[keys.length-1] + 1, "User #id141", `${date.toLocaleDateString().slice(0, 5)} ${date.toLocaleTimeString().slice(0, 5)}`, input.textContent, 0, false])
    } else {
        newComment = new ChildComment([+keys[keys.length-1] + 1, "User #id141", `${date.toLocaleDateString().slice(0, 5)} ${date.toLocaleTimeString().slice(0, 5)}`, input.textContent, 0, false, +input.getAttribute("data-parentID"), input.getAttribute("data-answer")])
    }
    information[newComment.id] = newComment
    saveAllChanges(information)
})