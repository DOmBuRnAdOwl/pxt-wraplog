
namespace wraplogger {
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

    export class logger {
        _columns: string[] = [];
        _insertedRows: number = 0;
        _lastTimestamp: number = -1;
        _bufferInstance: ringBuffer.circularBufferInstance = null;
        _storingFloats: boolean = false;
        constructor(colHeaders:string[],dataType=StoreChoice.Integer) {
            this._columns = colHeaders;
            if(dataType==StoreChoice.Float){
                this._storingFloats = true;
            }else{
                this._bufferInstance = new ringBuffer.circularBufferInstance(dataType);
            }
        }

        /**
         * Get the maximum number of rows that can be stored in the table
         * @returns the number of elements
         */
        //% block="max rows of $this"
        //% weight=50
        //% this.defl=table
        //% this.shadow=variables_get
        maxRows(): number {
            let maxInserts = this._bufferInstance.getMaxElements();
            let maxRows = Math.floor(maxInserts / (this._columns.length + 1));
            return maxRows;
        }

        /**
         * Get the current number of populated rows
         * @returns the number of rows
         */
        //% block="current row count of $this"
        //% weight=50
        //% this.defl=table
        //% this.shadow=variables_get
        populatedRows():number {
            return Math.min(this._insertedRows,this.maxRows());
        }

        logDataImpl(data:wraplogger.ColumnValue[]){
            let dataMap: { [key: string]: string } = {};
            
            // Populate dataMap with column values
            data.forEach(columnValue => {
                dataMap[columnValue.column] = columnValue.value;
            });

            // Add timestamp and calculate the time difference
            let currentTimestamp = control.millis();
            let timeDifference = this._lastTimestamp === -1 ? 0 : currentTimestamp - this._lastTimestamp;
            this._lastTimestamp = currentTimestamp;

            // Append time difference to the buffer
            this._bufferInstance.appendInt(timeDifference);

            // Append each column value, or append 0 if the column is missing
            for (let col of this._columns) {
                let toInsert = dataMap[col] !== undefined ? parseInt(dataMap[col]) : 0;
                this._bufferInstance.append(toInsert);
            }
            this._insertedRows++;
        }

        //% block="save buffer $this"
        //% weight=70
        //% this.defl=table
        //% this.shadow=variables_get
        saveBuffer(){
            flashlog.clear(true);
            flashlog.setTimeStamp(FlashLogTimeStampFormat.None); // Don’t include current timestamps

            // First log the column titles with empty values
            flashlog.beginRow();
            flashlog.logData("time(ms)", "");
            for (let i = 0; i < this._columns.length; i++) {
                flashlog.logData(this._columns[i], "");
            }
            flashlog.endRow();

            let getIndex = 0;
            let maxInserts = this._bufferInstance.getMaxElements();
            let maxRows = Math.floor(maxInserts / (this._columns.length + 1));
            let count = Math.min(this._insertedRows, maxRows);

            // Adjust the starting index if there are more rows than maxRows
            if (this._insertedRows > maxRows) {
                getIndex = maxInserts % (this._columns.length + 1);
            }

            let cumulativeTime = 0;
            for (let i = 0; i < count; i++) {
                flashlog.beginRow();
                
                // Log the cumulative time
                let time = this._bufferInstance.getInt(getIndex);
                flashlog.logData("time(ms)", "" + cumulativeTime);
                cumulativeTime += time;
                getIndex = (getIndex + 1) % maxInserts;

                // Log each column value
                for (let j = 0; j < this._columns.length; j++) {
                    let value = this._bufferInstance.get(getIndex);
                    flashlog.logData(this._columns[j], convertToText(value));
                    getIndex = (getIndex + 1) % maxInserts;
                }
                flashlog.endRow();
            }
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
        //% block="log to $this data $data1||$data2 $data3 $data4 $data5 $data6 $data7 $data8 $data9 $data10"
        //% this.defl=table
        //% this.shadow=variables_get
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
        //% weight=90
        logData(
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
            let dataToStore:wraplogger.ColumnValue[]=[];
            dataToStore.push(data1);
            if (data2) dataToStore.push(data2);
            if (data3) dataToStore.push(data3);
            if (data4) dataToStore.push(data4);
            if (data5) dataToStore.push(data5);
            if (data6) dataToStore.push(data6);
            if (data7) dataToStore.push(data7);
            if (data8) dataToStore.push(data8);
            if (data9) dataToStore.push(data9);
            if (data10) dataToStore.push(data10);
            this.logDataImpl(dataToStore);
        }
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
    //% block="table with columns $col1||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% blockId=wraploggercreatetable
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=100
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
    //% blockSetVariable=table
    export function createTable(
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
    ) : logger {
        let columns = [col1];
        if (col2) columns.push(col2);
        if (col3) columns.push(col3);
        if (col4) columns.push(col4);
        if (col5) columns.push(col5);
        if (col6) columns.push(col6);
        if (col7) columns.push(col7);
        if (col8) columns.push(col8);
        if (col9) columns.push(col9);
        if (col10) columns.push(col10);
        return new logger(columns);
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
    //% block="table storing $dataType with columns $col1 ||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% dataType.defl=StoreChoice.Integer
    //% blockId=wraploggercreatetableadv
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% group="micro:bit (V2)"
    //% weight=100
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
    //% blockSetVariable=table
    //% advanced=true
    export function createTableAdvanced(
        dataType:StoreChoice=StoreChoice.Integer,
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
    ) : logger {
        let columns = [col1];
        if (col2) columns.push(col2);
        if (col3) columns.push(col3);
        if (col4) columns.push(col4);
        if (col5) columns.push(col5);
        if (col6) columns.push(col6);
        if (col7) columns.push(col7);
        if (col8) columns.push(col8);
        if (col9) columns.push(col9);
        if (col10) columns.push(col10);
        return new logger(columns,dataType);
    }
}
