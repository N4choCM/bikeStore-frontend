import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { ProductElement } from "src/app/modules/product/product/product.component";
import { ProductService } from "src/app/modules/shared/services/product.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  chartBar: any;
  chartdoughnut: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log("Products Response: ", data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log("ERROR: ", error);
      }
    );
  }

  processProductResponse(resp: any) {
    const nameProduct: String[] = [];
    const quantity: number[] = [];

    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.productsList;

      listCProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        quantity.push(element.quantity);
      });

      //nuestro gráfico de barras
      this.chartBar = new Chart("canvas-bar", {
        type: "bar",
        data: {
          labels: nameProduct,
          datasets: [{ label: "Products", data: quantity }],
        },
      });

      //nuestro gráfico de doughnut
      this.chartdoughnut = new Chart("canvas-doughnut", {
        type: "doughnut",
        data: {
          labels: nameProduct,
          datasets: [{ label: "Products", data: quantity }],
        },
      });
    }
  }
}
