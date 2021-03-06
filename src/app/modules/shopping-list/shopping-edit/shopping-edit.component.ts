import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../../models/ingredient.model";
import {ShoppingListService} from "../../../services/shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../../../store/shopping-list/shopping-list.actions";
import * as fromShoppingList from "../../../models/store.model";

@Component({
  selector: 'shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})

export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') slForm: NgForm;

  private _subscription: Subscription;

  private _editMode = false;

  // private _editedItemIndex: number;

  private _editedItem: Ingredient;

  constructor(private _shoppingListService: ShoppingListService,
              private _store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this._subscription = this._store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this._editMode = true;
        this._editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this._editedItem.name,
          amount: this._editedItem.amount
        });
      } else {
        this._editMode = false;
      }
    });
    /*this._subscription = this._shoppingListService.startedEditing.subscribe((index: number) => {
      this._editedItemIndex = index;
      this._editMode = true;
      this._editedItem = this._shoppingListService.getIngredient(index);
      this.slForm.setValue({
        name: this._editedItem.name,
        amount: this._editedItem.amount
      })
    });*/
  }

  public onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this._editMode) {
      // this._shoppingListService.updateIngredient(this._editedItemIndex, newIngredient);
      // this._store.dispatch(new ShoppingListActions.UpdateIngredient({this._editedItemIndex, newIngredient}))
      this._store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      // this._shoppingListService.addIngredient(newIngredient);
      this._store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this._editMode = false;
    form.reset();
  }

  public onClear() {
    this.slForm.reset();
    this._editMode = false;
    this._store.dispatch(new ShoppingListActions.StopEdit());
  }

  public onDelete() {
    // this._shoppingListService.deleteIngredient(this._editedItemIndex);
    this._store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  get editMode(): boolean {
    return this._editMode;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._store.dispatch(new ShoppingListActions.StopEdit());
  }

}
