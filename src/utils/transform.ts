// corssTable转化成对象函数
export function transformToObject(data) {
    // 提取表头
    const headers = [];
    data[0].forEach(col => {
        if (col.title) headers.push(col.title);
        else if (col.contentType) headers.push(col.contentType);
        else headers.push('');
    });

    // 提取第二行的表头（如果有）
    const subHeaders = [];
    data[1].forEach(col => {
        if (col.title) subHeaders.push(col.title);
        else if (col.contentType) subHeaders.push(col.contentType);
        else subHeaders.push('');
    });

    // 合并表头
    const fullHeaders = headers.map((h, i) => {
        if (h && subHeaders[i]) return `${h}_${subHeaders[i]}`;
        return h || subHeaders[i] || `column_${i}`;
    });

    // 处理数据行
    const result = [];
    for (let i = 2; i < data.length; i++) {
        const row = data[i];
        const obj = {};

        row.forEach((cell, colIndex) => {
            if (!cell.value && cell.value !== 0) return;

            const header = fullHeaders[colIndex];
            if (!header) return;

            // 特殊处理某些字段
            if (cell.contentType === 'level') {
                obj.level1 = cell.value;
            } else if (cell.contentType === 'observationPoint') {
                obj.observationPoint = cell.value;
            } else if (header.includes('评价标准')) {
                obj.evaluationStandard = cell.value;
            } else if (header.includes('积点')) {
                obj.points = Number(cell.value);
            } else if (header.includes('说明')) {
                obj.description = cell.value;
            } else {
                // 默认处理
                obj[header] = cell.value;
            }
        });

        if (Object.keys(obj).length > 0) {
            result.push(obj);
        }
    }

    return result;
}

export function transformEvaluationData(data) {
    const dataRows = data.slice(2); // 跳过前两行表头
    const result = [];
    let currentLevel = null;
    let currentObservation = null;
    let standardsList = [];

    dataRows.forEach(row => {
        // 处理层次（level）
        const levelCell = row.find(cell => cell.contentType === 'level');
        if (levelCell) {
            // 保存前一个层次的数据
            if (currentLevel) {
                result.push({
                    level: currentLevel,
                    observationPoints: {
                        name: currentObservation || '',
                        list: [...standardsList]
                    }
                });
                standardsList = [];
            }
            currentLevel = levelCell.value;
        }

        // 处理观察点（observationPoint）
        const observationCell = row.find(cell => cell.contentType === 'observationPoint');
        if (observationCell) {
            currentObservation = observationCell.value;
        }

        // 处理评价标准
        const standardCell = row.find(cell =>
            cell.contentType === 'selectEvaluationStandard' && cell.index === '0'
        );
        const pointCell = row.find(cell =>
            cell.contentType === 'selectEvaluationStandard' && cell.index === '1'
        );
        const descriptionCell = row.find(cell =>
            cell.contentType === 'selectEvaluationStandard' && cell.index === '2'
        );

        if (standardCell) {
            standardsList.push({
                standard: standardCell.value || '',
                point: pointCell?.value || '',
                description: descriptionCell?.value || ''
            });
        }
    });

    // 添加最后一个层次的数据
    if (currentLevel) {
        result.push({
            level: currentLevel,
            observationPoints: {
                name: currentObservation || '',
                list: [...standardsList]
            }
        });
    }

    return result;
}