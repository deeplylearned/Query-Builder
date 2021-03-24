package com.vassarlabs.querybuilder.proj.ms.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

import com.vassarlabs.querybuilder.proj.elasticsearch.api.AggregateDocument;
import com.vassarlabs.querybuilder.proj.elasticsearch.api.FlattenedPOJO;

@Service
public class CreateExlFile{

	public byte[] createExcelForAggregation( List<AggregateDocument> aggregateDocumentList) throws IOException {

		int rowNo = 0;
		
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		SXSSFWorkbook workbook = new SXSSFWorkbook();
		Sheet sheet = workbook.createSheet("Sheet1"); 
		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short) 14);
		headerFont.setColor(IndexedColors.RED.getIndex());

		// Create a CellStyle with the font
		CellStyle headerCellStyle = workbook.createCellStyle();
		headerCellStyle.setFont(headerFont);

		List<LinkedHashMap<String,Object>> aggregateList = getAggregateListForReport(aggregateDocumentList);

		for(LinkedHashMap<String,Object> aggregateObject : aggregateList) {
			Row row = null;
			int colNo = 0;
			if(rowNo == 0) {
				row = sheet.createRow(rowNo);
				for (Map.Entry<String,Object> entry : aggregateObject.entrySet()) {	
					row.createCell(colNo).setCellValue(entry.getKey());	
					colNo ++;
				} 
				for(int i = 0; i < aggregateList.iterator().next().size(); i++) {
					sheet.autoSizeColumn(i);
				}
				rowNo++;
				colNo = 0;
			}

			row = sheet.createRow(rowNo);
			for (Map.Entry<String,Object> entry : aggregateObject.entrySet()) {	
				row.createCell(colNo).setCellValue(checkIfCellValueIsNull(entry));	
				colNo ++;
			}  
			rowNo++;
		}

//		for(int i = 0; i < aggregateList.iterator().next().size(); i++) {
//			sheet.autoSizeColumn(i);
//		}

//		String path = System.getProperty("user.home") + "/" + 
//				"queryBuilder";
//		File newFile = new File(path);
//		if(!newFile.exists()) {
//			newFile.mkdir();
//		}
//		
//		int num = 1;
//		String name = "ExcelFile_aggregation";
//		String filename = path +"/"+ name + ".xls";
//		File file = new File(filename);
//		while(file.exists()) {	
//			filename = path +"/"+ name + "("+num +").xls";
//			file = new File(filename);
//			num++;		
//		}
		
		//String filename = "/home/vassar/Documents/NewExcelFile_aggregation.xls" ;
		//FileOutputStream fileOut = new FileOutputStream(file);
		//fileOut.close();
		
		
//		workbook.write(out);
//		workbook.close();
//		System.out.println("Your excel file has been generated!" + workbook);
//		return new ByteArrayInputStream(out.toByteArray());
		
		
		//return "your file is successfully downloaded in home directory at : " + filename;
		
		
		
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		// FileOutputStream fileOut = null;
		/*try {
				fileOut = new FileOutputStream("patient-generated-report.xlsx");
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}*/
		try {
			workbook.write(bos);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			bos.close();
			workbook.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		byte[] bytes = bos.toByteArray();  

		return bytes;

	}

	public byte[] createExcelForFilter(FlattenedPOJO records) throws IOException {

		int rowNo = 0;
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		SXSSFWorkbook workbook = new SXSSFWorkbook();
		//CreationHelper createHelper = workbook.getCreationHelper();

		Sheet sheet = workbook.createSheet("Sheet1"); 
		Map<String,Integer> rowHeaderMap = records.getColumnMap();

		for(Map<String, Object> eachRecordMap : records.getFormatList()) {	
			populateExlSheet(eachRecordMap,sheet,rowHeaderMap,rowNo);
			rowNo++;
		}
		// Create a Font for styling header cells
		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short) 14);
		headerFont.setColor(IndexedColors.RED.getIndex());

		// Create a CellStyle with the font
		CellStyle headerCellStyle = workbook.createCellStyle();
		headerCellStyle.setFont(headerFont);
		
//		for(int i = 0; i < records.getColumnMap().size(); i++) {
//			sheet.autoSizeColumn(i);
//		}
		
//		String path = System.getProperty("user.home") + "/" + 
//				"queryBuilder";
//		File newFile = new File(path);
//		if(!newFile.exists()) {
//			newFile.mkdir();
//		}
		
//		int num = 1;
//		String name = "ExcelFile_filter";
//		String filename = path +"/"+ name + ".xls";
//		File file = new File(filename);
//		while(file.exists()) {	
//			filename = path +"/"+ name + "("+num +").xls";
//			file = new File(filename);
//			num++;		
//		}

		//String filename = "/home/vassar/Documents/NewExcelFile.xls" ;
		//FileOutputStream fileOut = new FileOutputStream(file);
		workbook.write(out);
		//fileOut.close();
		workbook.close();
		System.out.println("Your excel file has been generated!" + workbook);
		
		byte[] bytes = out.toByteArray();
		return bytes;
		//return "your file is successfully downloaded in home directory at : " + filename;

	}

	public void populateExlSheet(Map<String,Object> jsonMap , Sheet sheet,Map<String,Integer> rowHeaderMap,int rowNo) {

		int rowTotal = sheet.getPhysicalNumberOfRows();
		if(rowTotal == 0) {
			populateHeaderRow(sheet,rowHeaderMap);
			for(int i = 0; i < rowHeaderMap.size(); i++) {
				sheet.autoSizeColumn(i);
			}
		}else {
			Row row = sheet.createRow(rowNo);
			for (Map.Entry<String,Object> entry : jsonMap.entrySet()) {	
				row.createCell(rowHeaderMap.get(entry.getKey())).setCellValue(checkIfCellValueIsNull(entry));		
			}  
		}
	}

	private void populateHeaderRow(Sheet sheet,Map<String,Integer> headerMap) {
		Row rowhead = sheet.createRow(0);

		for (Map.Entry<String,Integer> entry : headerMap.entrySet()) {	
			rowhead.createCell(entry.getValue()).setCellValue(entry.getKey());
		}
	}

	private String checkIfCellValueIsNull(Entry<String, Object> entry) {

		if( entry.getValue() == null || entry.getValue().equals(null)) 
			return "NA";
		else 
			return entry.getValue().toString();
	}

	public List<LinkedHashMap<String,Object>> getAggregateListForReport(List<AggregateDocument> aggregateDocuments){

		List<LinkedHashMap<String,Object>> aggregateList = new ArrayList<LinkedHashMap<String,Object>>();

		for (AggregateDocument i : aggregateDocuments) {
			LinkedHashMap<String,Object> aggregateMap = new LinkedHashMap<>();
			for (Map.Entry<String,Object> entry : i.getKey().entrySet()) {
				aggregateMap.put(entry.getKey(), entry.getValue());
			}

			aggregateMap.put("record_count", i.getDocCount());
			for (Map.Entry<String,Object> entry : i.getValue().entrySet()) {
				aggregateMap.put(entry.getKey(), entry.getValue());
			}

			aggregateList.add(aggregateMap);
		}

		return aggregateList;
	}
}