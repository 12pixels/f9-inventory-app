import {
    Component,
    EventEmitter
} from 'angular2/core';

import {bootstrap} from 'angular2/platform/browser';


/**
 * Provides a `Product` object
 */
class Product {
    constructor(
        public sku:string,
        public name:string,
        public imageUrl:string,
        public department:string[],
        public price:number) {
    }
}
/**
* @ProductDepartment: A component to show the breadcrumbs to a
* Product's department
*/
@Component({
    selector: 'product-department',
    inputs: ['product'],
    template: `
        <div class="product-department">
          <span *ngFor="#name of product.department; #i=index">
            <a href="#">{{name}}</a>
            <span>{{i < (product.department.length-1)? '>': ''}}</span>
          </span>
        </div>
    `
})
class ProductDepartment {
    product: Product;
}
/**
* @PriceDisplay: A component to show the price of a
* Product
*/
@Component({
    selector: 'price-display',
    inputs: ['price'],
    template: `
        <div class="price-display">\${{price}}</div>
    `
})
class PriceDisplay {
    price: number;
}
/**
* @ProductImage: A component to show a single Product's image
*/
@Component({
    selector: 'product-image',
    host: {'class':'ui small image'},
    inputs: ['product'],
    template: `
        <img class="product-image" [src]="product.imageUrl">
    `
})
class ProductImage {
    product: Product;
}
/**
*  @ProductRow: A component for the view of single Product
*/
@Component({
    selector:'product-row',
    directives:[ProductImage, ProductDepartment, PriceDisplay],
    host: {'class':'item'},
    inputs: ['product'],
    template:`
        <product-image [product]="product"></product-image>
        <div class="content">
          <div class="header">{{product.name}}</div>
          <div class="meta">
            <div class="product-sku">SKU# {{product.sku}}</div>
          </div>
          <div class="description">
            <product-department [product]="product"></product-department>
          </div>
        </div>
        <price-display [price]="product.price"></price-display>
    `
})
class ProductRow {
    product: Product;
}


/**
 * @InventoryApp: the top-level component for our application
 */
/**
 * Component: Products List
 */
@Component({
    selector: 'products-list',
    directives: [ProductRow],
    inputs: ['productList'],
    outputs: ['onProductSelected'],
    template: `
    <div class='ui items'>
        <product-row
            *ngFor='#myProduct of productList'
            [product] = 'myProduct'
            (click) = 'clicked(myProduct)'
            [class.selected] = 'isSelected(myProduct)'>
        </product-row>
    </div>
    `
})
class ProductsList {

    /**
     * @input - productList - the Product[] passed to us
     */
    productList: Product[];


    /**
     * @output onProductSelected - outputs the current
     * Product whenever a new Product is selected
     */
    onProductSelected:EventEmitter<Product>;

    /**
     * @property  currentProduct - local state containing  the
     * currently selected Product
     * ( local component state )
     */
    currentProduct:Product;


    constructor() {
        this.onProductSelected = new EventEmitter();
    }

    clicked(product: Product): void {
        this.currentProduct = product;
        this.onProductSelected.emit(product);
    }

    isSelected(product: Product): boolean {
        if (!product || !this.currentProduct) {
            return false;
        }
        return product.sku === this.currentProduct.sku;
    }

}
@Component({
    selector: 'inventory-app',
    directives: [ProductsList],
    template: `
  <div class="inventory-app">
    <products-list
      [productList]="products"
      (onProductSelected)="productWasSelected($event)">
    </products-list>
  </div>
  `
})

class InventoryApp {

    products: Product[];

    constructor() {
        this.products = [
            new Product(
                'NICEHAT',
                'A nice black hat',
                '/resources/images/products/black-hat.jpg',
                ['Men', 'Accessories', 'Hats'],
                20.0),

            new Product(
                'MYSHOES',
                'Black Nikes',
                '/resources/images/products/black-shoes.jpg',
                ['Men', 'Shoes', 'Running'],
                64.99),

            new Product(
                'COAT',
                'Warm Coat',
                '/resources/images/products/blue-jacket.jpg',
                ['Women', 'Jackets', 'Out'],
                54.99),
        ]
    }

    productWasSelected(product:Product):void {
        console.log('Product selected: ', product);
    }
}


bootstrap(InventoryApp);
