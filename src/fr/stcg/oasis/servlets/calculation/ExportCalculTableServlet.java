package fr.stcg.oasis.servlets.calculation;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

@WebServlet("/workspace/calcul/exportCalculTable")
public class ExportCalculTableServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ExportCalculTableServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String content = request.getParameter("content");
		
		response.setHeader("Content-Disposition", "attachment; filename=export.xls");
		response.setContentType("application/vnd.ms-excel");
		
		HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Export");

        String[] rows = content.split(";");
        int rowIndex = 0;
        for(String row: rows)
        {
        	String[] cells = row.split("\\|\\|");
        	HSSFRow sheetRow = sheet.createRow((short)rowIndex);
        	rowIndex++;
        	
        	int cellIndex = 0;
        	for(String cell: cells)
        	{
        		sheetRow.createCell(cellIndex).setCellValue(cell);
        		cellIndex++;
        	}
        }
		
		OutputStream outStream = response.getOutputStream();
		
		workbook.write(outStream);
		workbook.close();
		
		outStream.flush();
		outStream.close();
	}
}
