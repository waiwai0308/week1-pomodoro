import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

  todoItem = [
    {
      id: (new Date()).getTime(),
      title: "the First thing to do today!",
      tomoto: 5,
      finished: false,
      doing: true,
      finishedDate: ''
    },    {
      id: (new Date()).getTime() + 1,
      title: "the second thing to do today!",
      tomoto: 0,
      finished: false,
      doing: false,
      finishedDate: ''
    },    {
      id: (new Date()).getTime() + 2,
      title: "the third thing to do today!",
      tomoto: 0,
      finished: false,
      doing: false,
      finishedDate: ''
    },   {
      id: (new Date()).getTime() + 3,
      title: "the forth thing to do today!",
      tomoto: 0,
      finished: false,
      doing: false,
      finishedDate: ''
    }
    ,   {
      id: (new Date()).getTime() + 4,
      title: "the first thing done!",
      tomoto: 7,
      finished: true,
      doing: false,
      finishedDate: new Date(new Date().getTime() - 87400000)
    },   {
      id: (new Date()).getTime() + 5,
      title: "the second thing done!",
      tomoto: 2,
      finished: true,
      doing: false,
      finishedDate: new Date(new Date().getTime() - 87400000 * 2)
    }
    ,   {
      id: (new Date()).getTime() + 6,
      title: "the third thing done!",
      tomoto: 11,
      finished: true,
      doing: false,
      finishedDate: new Date(new Date().getTime() - 87400000 * 6)
    }
  ];

  weekDateText;
  weekDateTomato = [0,0,0,0,0,0,0];
  weekRangeText;
  weekTotal;
  todayTotal;

  thisWeek = 0;

  lastWeek() {
    this.thisWeek -= 1 ;
    this.getWeekBargraphData();
  }

  nextWeek() {
    if(this.thisWeek == 0) return;
    this.thisWeek += 1 ;
    this.getWeekBargraphData();
  }

  getWeekBargraphData() {
    this.weekDateText = [];
    let today = new Date();
    let todayWeek = today.getDay();
    let weekStartDate = new Date(today)
    weekStartDate.setDate(today.getDate() - todayWeek + (7 * this.thisWeek));
    weekStartDate.setHours(0);
    weekStartDate.setMinutes(0);
    weekStartDate.setSeconds(0);
    for(let i = 0; i <= 6; i++) {
      let newDate = new Date(weekStartDate)
      newDate.setDate(weekStartDate.getDate() + i);
      let todayMonth = ((newDate.getMonth() + 1) < 10? "0"+(newDate.getMonth() + 1):(newDate.getMonth() + 1));
      let todayDate = ((newDate.getDate()) < 10? "0"+(newDate.getDate()):(newDate.getDate()));


      this.weekDateText.push(todayMonth + '.' + todayDate);
    }
    let weekStart = new Date(weekStartDate);
    let weekEnd = new Date(weekStart.getTime() + 86400000 * 6);

    for(let i = 0; i <= 6; i++) {
      let tomorrow = new Date(weekStart);
      let start = new Date(tomorrow);
      start.setDate(tomorrow.getDate() + i);
      tomorrow.setDate(tomorrow.getDate() + 1 + i);
      let end = new Date(tomorrow);
      let dayToDo = this.todoItem.filter(item => {
        let finishedDate = new Date(item.finishedDate)
        return finishedDate < end && finishedDate >= start
      });
      let totalTomato = 0;
      dayToDo.map(item => {
        totalTomato += item.tomoto;
      });

      if(todayWeek == i && this.thisWeek == 0){      
        let todayToDo = this.todoItem.filter(item => {
          let hasDate = false;
          if(item.finishedDate !== '') {
            let finishedDate = new Date(item.finishedDate);
            hasDate = (finishedDate < end && finishedDate >= start);
          }
          return ( hasDate || item.finishedDate == '')
        });

        this.todayTotal = 0;
        let todayTomato = 0;
        todayToDo.map(item => {
          todayTomato += item.tomoto;
        });
        if(this.thisWeek == 0) {
          this.todayTotal = todayTomato;
          this.weekDateTomato[i] = todayTomato;
        }
      } else {
        this.weekDateTomato[i] = totalTomato;
      }
    }
    this.weekRangeText = weekStart.getFullYear() + "." + (weekStart.getMonth() + 1) + "." + weekStart.getDate() + " ~ " + weekEnd.getFullYear() + "." + (weekEnd.getMonth() + 1) + "." + weekEnd.getDate();

    this.weekTotal = this.weekDateTomato.reduce(function (a, b) {
      return a + b;
    }, 0);
  }

  getTodoData() {
    return this.todoItem;
  }

  addTodoData(key, title) {
    this.todoItem.push({
      id: key,
      title: title,
      tomoto: 0,
      finished: false,
      doing: false,
      finishedDate: ''
    });
    let item = this.todoItem.filter( item => {
      return item.doing == true;
    });
    if(item.length == 0){
      this.setNowTodoItem('');
    }
  }

  addTodoTomoto() {
    this.todoItem.map( (item) => {
      if(item.doing) {
        item.tomoto = item.tomoto + 1;
      }
    })

    this.getWeekBargraphData();
  }

  setfinishedTodo(id, status) {
    this.todoItem.map((item) => {
      if(item.id == id) {
        item.finished = status;
        item.doing = false;
      }
    });
    let item = this.todoItem.filter( item => {
      return item.doing == true;
    });
    if(item.length == 0){
      this.setNowTodoItem('');
    }

    this.getWeekBargraphData();
  }

  setNowTodoItem(id) {
    let item = this.todoItem.filter( item => {
      item.doing = false;
      if(id !== '') {
        return item.finished == false && item.id == id;
      }else{
        return item.finished == false;
      }
    })
    if(item.length > 0) {
      item[0].doing = true;
    }
  }

  deleteTodo(id) {
    let deleteIndex;
    this.todoItem.map( (item, index) => {
      if(item.id == id) {
        deleteIndex = index;
      }
    });
    this.todoItem.splice(deleteIndex, 1);
    let item = this.todoItem.filter( item => {
      return item.doing == true;
    });
    if(item.length == 0){
      this.setNowTodoItem('');
    }
    this.getWeekBargraphData();
  }
}
