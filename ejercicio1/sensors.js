class Sensor {
    constructor(id, name, type, value, unit, updated_at) {
        this.id = id;
        this.name = name;
        this.setType(type);
        this.value = value;
        this.unit = unit;
        this.updated_at = updated_at;
    }

    setType(type) {
        const typosValidos = ['temperature', 'humidity', 'pressure'];
        if (typosValidos.includes(type)) {
            this.type = type;
        } else {
            throw new Error(`Tipo "${type}" no es válido. Los tipos válidos son: ${typosValidos.join(', ')}`);
        }
    }

    set updateValue(newValue) {
        let ahora = new Date()
        this.value = newValue;
        this.updated_at = ahora.toISOString();
    }
}
class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    async loadSensors(url) {
        try {
            const response = await fetch(url);
            const datos = await response.json();
            datos.forEach(infoSensor => {
                const sensor = new Sensor(
                    infoSensor.id,
                    infoSensor.name,
                    infoSensor.type,
                    infoSensor.value,
                    infoSensor.unit,
                    infoSensor.updated_at
                );
                this.addSensor(sensor);
            });
            this.render();
        } catch (error) {
            console.error('Error no se cargo el sensor:', error);
        }
    }
    

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();

monitor.loadSensors("./sensors.json");