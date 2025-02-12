
//% color="#EB32D5" weight=100
namespace wraplogger {
    let maxSamples = 100;
    let maxRows = 0;
    let times_buffer: Buffer;
    let values_buffer: Buffer;
    let tail = 0;
    let head = 0;
    let colNames = [""];
    let isFull = false;

    export class ColumnValue {
        public value: string;
        constructor(
            public column: string,
            value: any
        ) {
            this.value = "" + value;
        }
    }

    /**
     * A column and value to log to flash storage
     * @param column the column to set
     * @param value the value to set.
     * @returns A new value that can be stored in flash storage using log data
     */
    //% block="column $column value $value"
    //% value.shadow=math_number
    //% column.shadow=wraplogger_columnfield
    //% blockId=wraploggercreatecolumnvalue
    //% group="micro:bit (V2)"
    //% weight=80 
    export function createCV(column: string, value: any): ColumnValue {
        return new ColumnValue(column, value);
    }


    //% block="$column"
    //% blockId=wraplogger_columnfield
    //% group="micro:bit (V2)"
    //% blockHidden=true shim=TD_ID
    //% column.fieldEditor="autocomplete" column.fieldOptions.decompileLiterals=true
    //% column.fieldOptions.key="wraploggercolumn"
    export function _columnField(column: string) {
        return column
    }

    /**
     * Create a new buffer and set columns to be logged
     * @param col1 Title for first column to be added
     * @param col2 Title for second column to be added
     * @param col3 Title for third column to be added
     * @param col4 Title for fourth column to be added
     * @param col5 Title for fifth column to be added
     * @param col6 Title for sixth column to be added
     * @param col7 Title for seventh column to be added
     * @param col8 Title for eighth column to be added
     * @param col9 Title for ninth column to be added
     * @param col10 Title for tenth column to be added
     */
    //% block="create with columns $col1||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% blockId=wraploggercreatebuffer
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=70
    //% col1.shadow=wraplogger_columnfield
    //% col2.shadow=wraplogger_columnfield
    //% col3.shadow=wraplogger_columnfield
    //% col4.shadow=wraplogger_columnfield
    //% col5.shadow=wraplogger_columnfield
    //% col6.shadow=wraplogger_columnfield
    //% col7.shadow=wraplogger_columnfield
    //% col8.shadow=wraplogger_columnfield
    //% col9.shadow=wraplogger_columnfield
    //% col10.shadow=wraplogger_columnfield
    export function createBufferWithColumns(
        col1: string,
        col2?: string,
        col3?: string,
        col4?: string,
        col5?: string,
        col6?: string,
        col7?: string,
        col8?: string,
        col9?: string,
        col10?: string
    ) : void {
        let tmpColumns = [col1, col2, col3, col4, col5, col6, col7, col8, col9, col10];
        colNames = tmpColumns.map(el => (!!el ? el : null)).filter(el => el !== null);
        maxRows = Math.floor(maxSamples/(colNames.length +1));
        values_buffer = pins.createBuffer(maxRows* 2*(colNames.length));
        times_buffer = pins.createBuffer(maxRows* 2);
    }

    /**
     * Log data to buffer
     * @param data4 [optional] fourth column and value to be logged
     * @param data5 [optional] fifth column and value to be logged
     * @param data6 [optional] sixth column and value to be logged
     * @param data7 [optional] seventh column and value to be logged
     * @param data8 [optional] eighth column and value to be logged
     * @param data9 [optional] ninth column and value to be logged
     * @param data10 [optional] tenth column and value to be logged
     */
    //% block="log data $data1||$data2 $data3 $data4 $data5 $data6 $data7 $data8 $data9 $data10"
    //% blockId=wraploggerlog
    //% data1.shadow=wraploggercreatecolumnvalue
    //% data2.shadow=wraploggercreatecolumnvalue
    //% data3.shadow=wraploggercreatecolumnvalue
    //% data4.shadow=wraploggercreatecolumnvalue
    //% data5.shadow=wraploggercreatecolumnvalue
    //% data6.shadow=wraploggercreatecolumnvalue
    //% data7.shadow=wraploggercreatecolumnvalue
    //% data8.shadow=wraploggercreatecolumnvalue
    //% data9.shadow=wraploggercreatecolumnvalue
    //% data10.shadow=wraploggercreatecolumnvalue
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=100 
    export function logData(
        data1: wraplogger.ColumnValue,
        data2?: wraplogger.ColumnValue,
        data3?: wraplogger.ColumnValue,
        data4?: wraplogger.ColumnValue,
        data5?: wraplogger.ColumnValue,
        data6?: wraplogger.ColumnValue,
        data7?: wraplogger.ColumnValue,
        data8?: wraplogger.ColumnValue,
        data9?: wraplogger.ColumnValue,
        data10?: wraplogger.ColumnValue
    ): void {
        let insertIndex = head % maxRows;
        let tmpData = [ data1, data2, data3, data4, data5, data6, data7, data8, data9, data10 ];



        times_buffer.setNumber(NumberFormat.Int16LE, insertIndex* 2,control.millis());

        let tmpIndex=0;
        for(const elem of tmpData){
            if(!!elem){
                values_buffer.setNumber(NumberFormat.Int16LE, (insertIndex* 2)+tmpIndex*2, parseInt(elem.value));
                tmpIndex+=1;
            }
        }
        head= (head+1)%maxRows;
        if(head === tail){
            tail = (tail+1)%maxRows;
            isFull=true;
        }
    }




    //% block="save buffer"
    //% blockId=wraploggersavebuffer
    //% group="micro:bit (V2)"
    //% weight=60
    export function saveBuffer() : void {
        flashlog.clear(true);
        flashlog.setTimeStamp(FlashLogTimeStampFormat.None); // dont include current timestamps

        // first log each column title as empty
        flashlog.beginRow();
        flashlog.logData("times(ms)","");
        for (let i=0;i<colNames.length;i++) {
            flashlog.logData(colNames[i],"");
        }
        flashlog.endRow();

        let index = isFull ? tail :0;
        let count = isFull ? maxRows : head;
        let initialTime = times_buffer.getNumber(NumberFormat.Int16LE,index* 2);
        for(let i=0;i<count;i++){
            flashlog.beginRow();
            flashlog.logData("times(ms)",""+(times_buffer.getNumber(NumberFormat.Int16LE,index* 2) - initialTime));
            for (let j=0;j<colNames.length;j++) {
                flashlog.logData(colNames[j],""+values_buffer.getNumber(NumberFormat.Int16LE, (index*2)+(j*2)));
            }
            flashlog.endRow();
            index = (index+1)%maxRows;
        }

    }
}
