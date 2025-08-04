#!/usr/bin/env python3
"""
Script para agregar propiedades masvendidos y oferta a todos los productos
"""

import json
import os

def update_products_json():
    # Ruta del archivo JSON
    json_path = "json/diccionario.json"
    
    # Leer el archivo JSON
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Actualizar cada producto
    for producto in data['productos']:
        # Si no tiene la propiedad masvendidos, agregarla como False
        if 'masvendidos' not in producto:
            producto['masvendidos'] = "False"
        
        # Si no tiene la propiedad oferta, agregarla como False
        if 'oferta' not in producto:
            producto['oferta'] = "False"
    
    # Guardar el archivo actualizado
    with open(json_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    
    print(f"✅ Archivo actualizado: {len(data['productos'])} productos procesados")
    
    # Contar productos con cada propiedad
    mas_vendidos = sum(1 for p in data['productos'] if p.get('masvendidos') == "True")
    ofertas = sum(1 for p in data['productos'] if p.get('oferta') == "True")
    ambos = sum(1 for p in data['productos'] if p.get('masvendidos') == "True" and p.get('oferta') == "True")
    
    print(f"📊 Estadísticas:")
    print(f"   - Productos más vendidos: {mas_vendidos}")
    print(f"   - Productos en oferta: {ofertas}")
    print(f"   - Productos con ambas etiquetas: {ambos}")

if __name__ == "__main__":
    update_products_json()
