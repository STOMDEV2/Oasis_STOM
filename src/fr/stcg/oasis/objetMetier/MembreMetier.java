package fr.stcg.oasis.objetMetier;

import java.util.Collection;
import java.util.Iterator;
import java.util.Scanner;

import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.Member;
import fr.stcg.oasis.dao.DaoFactory;

public class MembreMetier {

	
//	public static boolean saveMembers(Collection<Membre> membres, Dimension dimension)
//	{
//		try
//		{
//			Iterator<Membre> itMembers = membres.iterator();
//			Membre previousMember = new Membre();
//			
//			int i = 0;
//			
//			while(itMembers.hasNext())
//			{
//				Membre memberToAdd = (Membre) itMembers.next();
//				
//				if( i==0 )
//				{
//					memberToAdd.setAssociatedDimension(dimension);
//					memberToAdd.setParent(null);
//					System.out.println(memberToAdd.toString());
//				}
//				else
//				{
//					memberToAdd.setAssociatedDimension(dimension);
//					memberToAdd.setParent(previousMember);
//					System.out.println(memberToAdd.toString());
//				}
//				
//				
//				
//				previousMember = DaoFactory.getMembreDao().add(memberToAdd);
//				i++;
//			}
//			
//			return true;
//		}
//		catch(Exception e)
//		{
//			System.err.println(e.getMessage());
//		}
//		return false;
//	}
}
