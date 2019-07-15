import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { TodoService } from '../todo.service';
import { CountdownService } from '../countdown.service';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.5s', style({ right: 0 })),
      ]),
      transition(':leave', [
        animate('.5s', style({ right: "-100%" }))
      ])
    ]),
    trigger('changeValue', [
      transition(':enter', [
        style({ transform: 'translateX(-30%)', opacity: 0 }),
        animate('.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ position: 'absolute' }),
        animate('.5s ease-out', style({ opacity: 0 })),
      ]),
    ])
  ]
})
export class PomodoroComponent implements OnInit {

  // 資料
  todoItem = [];
  settingType = '0';

  // 顯示設定頁
  showSettingComponent = false;

  constructor(public todoService: TodoService,public countdownService: CountdownService) {
    this.todoItem = this.todoService.getTodoData();
  }
  
  ngOnInit() {
  }

  // 開關子頁面
  toggleSettingComponent(id) {
    this.showSettingComponent = !this.showSettingComponent;
    if(id) {
      this.settingType = id;
    }
  }

  endCountDown() {
    this.countdownService.endCountDown();
  }

  // 完成待辦
  finishedTodo(id) {
    this.todoService.setfinishedTodo(id ,true);
    if(this.countdownService.isCountDown){
      this.countdownService.endCountDown();
    }
  }

  // 過濾等待待辦
  waitTodoItemFilter(data) {
    return data.filter( item => {
      return item.finished == false && item.doing == false;
    }).slice(0,3);
  }

  // 重置現在待辦
  setNowTodo(id) {
    if(this.countdownService.isCountDown) {
      alert("請先結束目前番茄鐘!");
      return;
    }
    this.todoService.setNowTodoItem(id);
  }

  // 取的現在待辦
  getNowTodoItem(data) {
    return data.filter( item => {
      return item.doing == true;
    })
  }

  // 增加待辦
  addToDoItem(e) {
    if(e.value == '') return;
    let key = (new Date()).getTime();
    this.todoService.addTodoData(key, e.value);
    e.value = '';
  }

}

