import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type Props = {
  title: string;
  content: string | JSX.Element;
  confirmButton?: {
    label?: string;
    onClick: () => void;
  };
  cancelButton?: {
    label?: string;
  };
  triggerButton: string | JSX.Element;
};

export default function ConfirmDailog({
  title,
  content,
  confirmButton,
  cancelButton,
  triggerButton,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {typeof triggerButton === "string" ? (
          <Button variant="outline">{triggerButton}</Button>
        ) : (
          triggerButton
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {typeof content === "string" ? (
            <AlertDialogDescription>{content}</AlertDialogDescription>
          ) : (
            content
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {cancelButton?.label || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmButton?.onClick}>
            {confirmButton?.label || "OK"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
