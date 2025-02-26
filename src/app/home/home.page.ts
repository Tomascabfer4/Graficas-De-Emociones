import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonLabel, IonItem, IonSelectOption, IonSelect, IonGrid, IonRow, IonCol, IonCardContent, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonModal, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';
import { DatosService } from '../datos.service';
import { BaseChartDirective } from 'ng2-charts';
import { OverlayEventDetail } from '@ionic/core/components';
import { Emociones } from '../emociones';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonLabel,IonItem, IonSelectOption, IonSelect, IonCardContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonFooter, BaseChartDirective, IonButton, IonButtons],
})
export class HomePage {
  @ViewChild(IonModal) modal!: IonModal;
  emociones: Emociones[] = [];
  cursos: string[] = [];
  cursoSeleccionado: string = ''; 
  asignaturas: string[] = [];
  asignaturaSeleccionada: string = '';
  actividades: string[] = [];
  actividadSeleccionada: string = '';
  
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Nervios', 
                           'Miedo',
                           'Alegría', 
                           'Enfado', 
                           'Vergüenza', 
                           'Tristeza', 
                           'Sorpresa', 
                           'Asco', 
                           'Ansiedad', 
                           'Frustación',
                           'Orgullo'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [];

  constructor(private datos: DatosService) {
    this.datos.getDatos().subscribe((data) => {
      this.emociones = data;
      console.log('Datos obtenidos de Firestore: ', data);

      // Extraer valores únicos de curso, asignatura y actividad
      this.cursos = [...new Set(this.emociones.map(emocion => emocion.curso))];
      this.asignaturas = [...new Set(this.emociones.map(emocion => emocion.asignatura))];
      this.actividades = [...new Set(this.emociones.map(emocion => emocion.actividad))];
    });
  }

  calcularMediaEmociones() {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada || !this.actividadSeleccionada) {
      console.log("Selecciona todos los filtros antes de ver la gráfica.");
      this.barChartData = [];
      return;
    }
  
    // Filtrar los datos según los valores seleccionados
    const emocionesFiltradas = this.emociones.filter((emocion: any) =>
      emocion.curso === this.cursoSeleccionado &&
      emocion.asignatura === this.asignaturaSeleccionada &&
      emocion.actividad === this.actividadSeleccionada
    );
  
    if (emocionesFiltradas.length === 0) {
      console.log("No hay datos para los filtros seleccionados.");
      this.barChartData = [];
      return;
    }
  
    // Inicializar sumas y conteos
    const sumas: { [key: string]: number } = {};
    const conteos: { [key: string]: number } = {};
  
    // Recorrer las emociones y acumular sumas
    emocionesFiltradas.forEach(({ emocion, rango }: { emocion: string, rango: number }) => {
      if (!sumas[emocion]) {
        sumas[emocion] = 0;
        conteos[emocion] = 0;
      }
      sumas[emocion] += rango;
      conteos[emocion]++;
    });
  
    // Calcular la media de cada emoción
    const medias = Object.keys(sumas).map(emocion => ({
      emocion,
      media: sumas[emocion] / conteos[emocion]
    }));
  
    // Configurar etiquetas del eje X
    this.barChartLabels = medias.map(item => item.emocion);
  
    // Crear un dataset por emoción para que cada barra tenga su label en la leyenda
    this.barChartData = medias.map((item, index) => {
      // Crear un array de nulls y asignar solo el valor correspondiente a la emoción en su índice correcto
      const dataArray = new Array(medias.length).fill(null);
      dataArray[index] = item.media; // Solo ponemos el valor en su lugar
  
      return {
        data: dataArray, // Un solo valor en su posición correcta
        label: item.emocion, // Nombre de la emoción en la leyenda
        backgroundColor: this.getColor(index),
        borderColor: this.getBorderColor(index),
        borderWidth: 3,
      };
    });
  
    console.log("Media de emociones calculada:", this.barChartData);
  }
  
  // Método para obtener un color único para cada emoción
  getColor(index: number): string {
    const colors = [
      'rgba(255, 99, 132, 0.2)',  // Rojo
      'rgba(54, 162, 235, 0.2)',  // Azul
      'rgba(255, 206, 86, 0.2)',  // Amarillo
      'rgba(75, 192, 192, 0.2)',  // Verde
      'rgba(153, 102, 255, 0.2)', // Púrpura
      'rgba(255, 159, 64, 0.2)',  // Naranja
      'rgba(201, 203, 207, 0.2)', // Gris
    ];
    return colors[index % colors.length];
  }
  
  // Método para obtener un color de borde único para cada emoción
  getBorderColor(index: number): string {
    const borderColors = [
      'rgba(255, 99, 132, 1)',  // Rojo
      'rgba(54, 162, 235, 1)',  // Azul
      'rgba(255, 206, 86, 1)',  // Amarillo
      'rgba(75, 192, 192, 1)',  // Verde
      'rgba(153, 102, 255, 1)', // Púrpura
      'rgba(255, 159, 64, 1)',  // Naranja
      'rgba(201, 203, 207, 1)', // Gris
    ];
    return borderColors[index % borderColors.length];
  }
  

  cancelar() {
    this.modal.dismiss(null, 'cancelar');
  }

  confirmar() {
    this.modal.dismiss('confirmar');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirmar') {
      
    }
  }

}
