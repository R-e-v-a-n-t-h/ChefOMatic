from classes import classes
from ultralytics import YOLO
import torch
import numpy as np
import cv2
import time
import easyocr


class CompleteRecognition:
    def __init__(self, threshold):

        self.model = YOLO("best.pt")
        self.reader = easyocr.Reader(["en"], gpu=True)
        self.classes = classes
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.threshold = threshold

    def obj_score_frame(self, frame):

        self.model.to(self.device)
        x_shape, y_shape = frame.shape[1], frame.shape[0]
        frame = [frame]
        results = self.model(frame)
        # print(results[0].boxes)
        cls = results[0].boxes.cls.tolist()
        xyxyn = results[0].boxes.xyxyn.tolist()
        conf = results[0].boxes.conf.tolist()

        labels = []
        cord = []
        percent = []
        for i in range(len(cls)):
            if conf[i] > self.threshold:
                labels.append(classes[int(cls[i])])  # LABELS

                x1, y1, x2, y2 = int(xyxyn[i][0] * x_shape), int(xyxyn[i][1] * y_shape), int(
                    xyxyn[i][2] * x_shape), int(xyxyn[i][3] * y_shape)
                cord.append([x1, y1, x2, y2])  # BOX DIAGONAL COORDINATES

                percent.append(conf[i]*100)  # CONFIDENCE PERCENT

        return labels, cord, percent

    def ocr_score_frame(self, frame):
        results = self.reader.readtext(frame)
        labels = []
        cords = []
        percent = []
        for i in range(len(results)):
            confidence = results[i][2]
            if confidence > self.threshold:
                points = results[i][0]
                label = results[i][1]
                x1, y1 = points[3]
                x2, y2 = points[1]

                labels.append(label)
                cords.append([x1, y1, x2, y2])
                percent.append(confidence)

        return labels, cords, percent


    def plot_boxes(self,results,frame):
        labels, cord, confidence = results
        n = len(labels)
        for i in range(n):
            row = cord[i]
            x1, y1, x2, y2 = row
            bgr = (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 2)
            cv2.putText(frame, labels[i]+"  "+str(confidence[i]*100)+"%", (x1, y1), cv2.FONT_HERSHEY_DUPLEX, 0.9, bgr, 2)

        return frame        
        
    
    
    def __call__(self, frame):
        
        obj_labels, obj_coordinates, obj_confidence = self.obj_score_frame(frame)
        ocr_labels, ocr_coordinates, ocr_confidence = self.ocr_score_frame(frame)
        labels=obj_labels+ocr_labels
        cords=obj_coordinates+ocr_coordinates
        percent=obj_confidence+ocr_confidence
        results= [labels,cords,percent]
        frame = self.plot_boxes(results, frame)
        return [frame, set(labels)]
        
        # results = {
        #     "obj": {
        #         "labels": obj_labels,
        #         "coordinates": obj_coordinates,
        #         "confidence": obj_confidence
        #     },
        #     "ocr": {
        #         "labels": ocr_labels,
        #         "coordinates": ocr_coordinates,
        #         "confidence": ocr_confidence
        #     }
        # }
        # return results

