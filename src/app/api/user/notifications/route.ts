import { authOptions } from "@/config/auth";
import prismaClient from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { 
        emailNotifications, 
        pushNotifications, 
        newBackerNotification, 
        commentNotification, 
        updateNotification, 
        milestoneNotification 
    } = body;

    if(!session?.user){
        return NextResponse.json({
            message: "user is not found"
        }, {
            status: 400
        })
    }

    let notifications = await prismaClient.notificationSettings.findUnique({
        where: {
            userId: session.user.id
        }
    })
    if(!notifications){
        notifications = await prismaClient.notificationSettings.create({
            data: {
                userId: session.user.id,
                emailNotifications: false,
                pushNotifications: false,
                newBackerNotification: false,
                commentNotification: false,
                updateNotification: false,
                milestoneNotification: false 
            }
        })
    } 5

    await prismaClient.notificationSettings.update({
        where: {
            userId: session.user.id
        }, 
        data: {
            emailNotifications:emailNotifications !== "undefined" ? emailNotifications : notifications.emailNotifications,  
            pushNotifications: pushNotifications !== "undefined" ? pushNotifications : notifications.pushNotifications,
            newBackerNotification   : newBackerNotification !== "undefined" ? newBackerNotification : notifications.newBackerNotification,
            commentNotification : commentNotification !== "undefined" ? commentNotification : notifications.commentNotification,
            updateNotification  : updateNotification !== "undefined" ? updateNotification : notifications.updateNotification,
            milestoneNotification   : milestoneNotification !== "undefined" ? milestoneNotification : notifications.milestoneNotification
        }
    });
    return NextResponse.json(notifications);
  } catch(error){
    console.error("Error updating notification settings:", error); // Added logging
    return NextResponse.json({ message: "Failed to update notification settings", error: error instanceof Error ? error.message : String(error) }, {
        status:500
    })
  }
}
