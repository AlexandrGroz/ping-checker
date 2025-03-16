import './css/global.css'
import './css/main_page.css'
import {TableActions} from "./js/table_actions.js";
import {CSV} from './js/csv.js'

document.querySelector('#app').innerHTML = `
    <header class="main_wrapper">
    </header>
    
    <div class="main_wrapper main_content">
        <div class="inside_wrapper">
            <table>
                <thead>
                    <tr class="disable_interaction">
                        <th>Хост</th>
                        <th>Ping, мс</th>
                        <th>Доставленных пакетов</th>
                        <th>Недоставленных пакетов</th>
                        <th>Время последнего успешного ping</th>
                        <th class="th_service">Действия со строками</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            
            <div class="table_action_buttons disable_interaction">
                <div class="main_action add_ip_button" onclick="TableActions.addRow(this)">Добавить IP</div>
                <div class="csv_actions">
                    <div class="main_action import" onclick="CSV.importCSVButton()">Импортировать CSV</div>
                    <input class="hidden" type="file" accept=".csv" onchange="CSV.importCSV(this)">
                    <div class="main_action export" onclick="CSV.exportCSV(this)">Экспортировать CSV</div>
                </div>
            </div>
        </div>
    </div>

    <footer class="main_wrapper">
    </footer>
`