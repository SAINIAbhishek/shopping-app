import {Injectable} from "@angular/core";
import {Recipe} from "../models/recipe.model";
import {Ingredient} from "../models/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";
import {Subject} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from '../store/shopping-list/shopping-list.actions';
import * as fromShoppingList from "../models/store.model";

@Injectable({providedIn: "root"})
export class RecipeService {

	recipesChanged = new Subject<Recipe[]>();

	private recipes: Recipe[] = [
		/*new Recipe(
			'Tasty Schnitzel',
			'A super-tasty Schnitzel - just awesome!',
			'https://www.evopedia.net/wp-content/uploads/2018/06/1280px-Wiener-Schnitzel02.jpg',
			[new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
		),
		new Recipe('Big Fat Burger',
			'What else you need to say?',
			'https://storage.needpix.com/rsynced_images/burger-2762431_1280.jpg',
			[new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
		)*/
	];

	constructor(private _shoppingListService: ShoppingListService,
							private _store: Store<fromShoppingList.AppState>) { }

	public setRecipes(recipes: Array<Recipe>) {
		this.recipes = recipes;
		this.recipesChanged.next(this.recipes.slice());
	}

	getRecipes() {
		return this.recipes.slice();
	}

	getRecipe(index: number) {
		return this.recipes[index];
	}

	public addIngredientsToShoppingList(ingredients: Ingredient[]) {
		//this._shoppingListService.addIngredients(ingredients);
		this._store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
	}

	addRecipe(recipe: Recipe) {
		this.recipes.push(recipe);
		this.recipesChanged.next(this.recipes.slice());
	}

	public updateRecipe(index: number, newRecipe: Recipe) {
		this.recipes[index] = newRecipe;
		this.recipesChanged.next(this.recipes.slice());
	}

	public deleteRecipe(index: number) {
		this.recipes.splice(index, 1);
		this.recipesChanged.next(this.recipes.slice());
	}

}
