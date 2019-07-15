import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TodoService } from '../todo.service';
import { CountdownService } from '../countdown.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: [
    trigger('waitTodo', [
      transition(':enter', [
        style({ 'max-height': '0px' }),
        animate('.5s', style({ 'max-height': '100%' })),
      ]),
      transition(':leave', [
        animate('.3s', style({ 'height': '0px' }))
      ])
    ]),
    trigger('finishedTodo', [
      transition(':enter', [
        style({ 'max-height': '0px' }),
        animate('.5s', style({ 'max-height': '100%' })),
      ]),
      transition(':leave', [
        animate('.3s', style({ 'height': '0px' }))
      ])
    ])
  ]
})

export class SettingComponent implements OnInit {
  @Output() closeComponent = new EventEmitter<string>();
  @Input() parentSettingType;

  settingType = '0';

  showWaitTodo = true;
  showFinishedTodo = false;

  todoItem = [];

  constructor(public todoService: TodoService,public countdownService: CountdownService) { 
    this.todoItem = this.todoService.getTodoData();
  }

  audio = ['none','default','alarm', 'bell', 'whistle', 'rock'];

  ngOnInit() {
    this.settingType = this.parentSettingType;
    this.todoService.getWeekBargraphData();
  }

  closeSetting() {
    this.closeComponent.emit();
  }

  changeSettingType(id: any){
    this.settingType = id;
  }


  // 調整完成與未完成
  setfinishedTodo(id, status) {
    this.todoService.setfinishedTodo(id, status);
  }
  setNowTodo(id) {
    if(this.countdownService.isCountDown) {
      alert("請先結束目前番茄鐘!");
      return;
    }
    this.todoService.setNowTodoItem(id);
  }

  // 新增待辦
  addToDoItem(e) {
    if(e.value == '') return;
    let key = (new Date()).getTime();
    this.todoService.addTodoData(key, e.value);
    e.value = '';
  }

  deleteTodo(id) {
    this.todoService.deleteTodo(id);
  }

  // 資料過濾
  waitTodoFilter(data) {
    return data.filter( (item) => {
      return item.finished == false;
    });
  }
  doneTodoFilter(data) {
    return data.filter( (item) => {
      return item.finished == true;
    });
  }
  getNowTodoItem(data) {
    return data.filter( item => {
      return item.doing == true;
    })
  }
}
