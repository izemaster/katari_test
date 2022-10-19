<?php

namespace App\Http\Controllers;

use App\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NoticiaController extends Controller
{
    public function index(){
        $noticias = Noticia::orderBy('updated_at','desc')->get();
        return response()->json([
            'status'=>200,
            'noticias'=>$noticias
        ]);
    }
    public function show(Noticia $noticia)
    {
        return response()->json([
            'noticia'=>$noticia
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'titulo'=>'required',
            'descripcion'=>'required',
            'imagen'=>'required|image'
        ]);


            $imagePath = $request->file('imagen')->store('noticias/imagen','public');
            //Storage::disk('public')->putFileAs('noticias/imagen', $request->imagen,$imageName);
            Noticia::create([
                'titulo'=>$request->titulo,
                'descripcion' => $request->descripcion,
                'imagen'=>$imagePath]);

            return response()->json([
                'status' => 200,
                'message'=>'Noticia creada'
            ]);

    }

    public function update(Request $request, Noticia $noticia)
    {
        $request->validate([
            'titulo'=>'required',
            'descripcion'=>'required',
            'imagen'=>'nullable'
        ]);

        try{

            $noticia->update([
                "titulo" => $request->titulo,
                "descripcion" => $request->descripcion,
            ]);

            if($request->hasFile('imagen')){

                if($noticia->imagen){
                    $exists = Storage::disk('public')->exists($noticia->imagen);
                    if($exists){
                        Storage::disk('public')->delete($noticia->imagen);
                    }
                }


                $imagePath = $request->file('imagen')->store('noticias/imagen','public');
                $noticia->imagen = $imagePath;
                $noticia->save();
            }

            return response()->json([
                'message'=>'Noticia actualizada correctamente'
            ]);

        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'message'=>'No fue posible actualizar la noticia'
            ],500);
        }
    }

    public function destroy($id)
    {
        $noticia = Noticia::find($id);
        if($noticia -> delete()){
            return response()->json(["status" => 200, "message"=>"Noticia eliminada exitosamente"]);
        }else{

        }
    }
}
